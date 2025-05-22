from flask import Blueprint, jsonify, request
from services.database import Database

order_routes = Blueprint('order_routes', __name__)
db = Database()

@order_routes.route('/history/<username>', methods=['GET'])
def get_order_history(username):
    """Get order history for a user"""
    try:
        query = """
            SELECT o.OrderID as orderid, o.OrderDate as orderdate, o.Status as status, s.Name as store_name,
                   s.City as store_city, s.State as store_state,
                   COUNT(od.ProductID) as item_count,
                   SUM(p.Price * od.Quantity) as total_amount
            FROM Orders o
            JOIN OrderDetails od ON o.OrderID = od.OrderID
            JOIN Product p ON od.ProductID = p.ProductID
            JOIN Store s ON o.StoreID = s.StoreID
            WHERE o.Username = %s
            GROUP BY o.OrderID, o.OrderDate, o.Status, s.Name, s.City, s.State
            ORDER BY o.OrderDate DESC
        """
        orders = db.execute_query_with_column_names(query, (username,))
        
        # Convert datetime objects to strings for JSON serialization
        for order in orders:
            if order.get('orderdate'):
                order['orderdate'] = str(order['orderdate'])
        
        return jsonify(orders)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_routes.route('/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    """Get details of a specific order"""
    try:
        # Get order header details
        order_query = """
            SELECT o.OrderID as orderid, o.Username as username, o.OrderDate as orderdate, o.Status as status, 
                   s.StoreID as storeid, s.Name as store_name, s.Address as store_address,
                   s.City as store_city, s.State as store_state
            FROM Orders o
            JOIN Store s ON o.StoreID = s.StoreID
            WHERE o.OrderID = %s
        """
        orders = db.execute_query_with_column_names(order_query, (order_id,))
        
        if not orders:
            return jsonify({"error": "Order not found"}), 404
        
        order = orders[0]
        
        # Convert datetime objects to strings for JSON serialization
        if order.get('orderdate'):
            order['orderdate'] = str(order['orderdate'])
        
        # Get order items
        items_query = """
            SELECT od.ProductID as productid, p.Name as product_name, od.Quantity as quantity,
                   p.Price as price, (p.Price * od.Quantity) as total_price
            FROM OrderDetails od
            JOIN Product p ON od.ProductID = p.ProductID
            WHERE od.OrderID = %s
        """
        items = db.execute_query_with_column_names(items_query, (order_id,))
        order['items'] = items
        
        # Calculate totals
        order['total_items'] = sum(item['quantity'] for item in items)
        order['subtotal'] = sum(item['total_price'] for item in items)
        order['tax'] = round(order['subtotal'] * 0.08, 2)  # 8% tax
        order['total'] = order['subtotal'] + order['tax']
        
        return jsonify(order)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_routes.route('/place', methods=['POST'])
def place_order():
    """Place a new order"""
    try:
        data = request.get_json()
        username = data.get('username')
        store_id = data.get('store_id')
        
        if not all([username, store_id]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Get user's cart
        cart_query = """
            SELECT c.ProductID as productid, c.Quantity as quantity
            FROM Cart c
            WHERE c.Username = %s
        """
        cart_items = db.execute_query_with_column_names(cart_query, (username,))
        
        if not cart_items:
            return jsonify({"error": "Cart is empty"}), 400
        
        # Create new order
        order_query = """
            INSERT INTO Orders (Username, StoreID, Status)
            VALUES (%s, %s, 'Pending')
            RETURNING OrderID
        """
        result = db.execute_query(order_query, (username, store_id))
        order_id = result[0][0]
        
        # Create order details for each cart item
        for item in cart_items:
            details_query = """
                INSERT INTO OrderDetails (OrderID, ProductID, Quantity)
                VALUES (%s, %s, %s)
            """
            db.execute_query(details_query, (order_id, item['productid'], item['quantity']), fetch=False)
            
            # Update product inventory in the store
            update_inventory_query = """
                UPDATE Supplies
                SET Quantity = Quantity - %s
                WHERE StoreID = %s AND ProductID = %s
                AND Quantity >= %s
            """
            db.execute_query(
                update_inventory_query, 
                (item['quantity'], store_id, item['productid'], item['quantity']),
                fetch=False
            )
        
        # Clear the user's cart
        clear_cart_query = "DELETE FROM Cart WHERE Username = %s"
        db.execute_query(clear_cart_query, (username,), fetch=False)
        
        return jsonify({
            "success": True,
            "order_id": order_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_routes.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    try:
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({"error": "Status is required"}), 400
        
        if status not in ['Pending', 'Shipped', 'Delivered', 'Cancelled']:
            return jsonify({"error": "Invalid status value"}), 400
        
        update_query = """
            UPDATE Orders
            SET Status = %s
            WHERE OrderID = %s
        """
        db.execute_query(update_query, (status, order_id), fetch=False)
        
        return jsonify({
            "success": True,
            "order_id": order_id,
            "status": status
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500 