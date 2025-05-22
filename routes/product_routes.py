from flask import Blueprint, jsonify, request
from services.database import Database

product_routes = Blueprint('product_routes', __name__)
db = Database()

@product_routes.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        query = """
            SELECT 
                CategoryID as id,
                CategoryName as name 
            FROM ShoppingCategory
            ORDER BY CategoryName
        """
        categories = db.execute_query_with_column_names(query)
        return jsonify(categories)
    except Exception as e:
        print(f"Error fetching categories: {str(e)}")  # Debug logging
        return jsonify({"error": str(e)}), 500

@product_routes.route('/list', methods=['GET'])
def get_product_list():
    """Get list of products with optional filtering"""
    try:
        # Get filter parameters
        category_id = request.args.get('category')
        pet_type_id = request.args.get('pet_type')
        
        # Validate parameters
        if not category_id or not pet_type_id:
            return jsonify({"error": "Category ID and Pet Type ID are required"}), 400
            
        try:
            category_id = int(category_id)
            pet_type_id = int(pet_type_id)
        except ValueError:
            return jsonify({"error": "Invalid category ID or pet type ID"}), 400

        # Build the query
        query = """
            SELECT 
                p.ProductID as product_id,
                p.Name as name,
                p.Price as price,
                sc.CategoryName as category_name,
                pt.PetTypeName as pet_type_name,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM Supplies s 
                        WHERE s.ProductID = p.ProductID AND s.Quantity > 0
                    ) THEN true
                    ELSE false
                END as in_stock
            FROM Product p
            JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID
            JOIN PetType pt ON p.PetTypeID = pt.PetTypeID
            WHERE p.CategoryID = %s AND p.PetTypeID = %s
            ORDER BY p.Name
        """
        
        products = db.execute_query_with_column_names(query, (category_id, pet_type_id))
        
        # Format prices to 2 decimal places
        for product in products:
            product['price'] = float(product['price'])
        
        return jsonify(products)
    except Exception as e:
        print(f"Error in get_product_list: {str(e)}")  # Debug logging
        return jsonify({"error": str(e)}), 500

@product_routes.route('/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    """Get details for a specific product"""
    try:
        query = """
            SELECT p.ProductID as id, p.Name as name, p.Price as price, 
                   sc.CategoryID as categoryid, sc.CategoryName as category, 
                   pt.PetTypeID as pettypeid, pt.PetTypeName as pet_type
            FROM Product p
            JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID
            JOIN PetType pt ON p.PetTypeID = pt.PetTypeID
            WHERE p.ProductID = %s
        """
        products = db.execute_query_with_column_names(query, (product_id,))
        
        if not products:
            return jsonify({"error": "Product not found"}), 404
        
        product_details = products[0]
        
        # Get store availability
        availability_query = """
            SELECT s.StoreID as storeid, s.Name as store_name, s.Address as address, 
                   s.ContactNumber as contactnumber, s.City as city, s.State as state, su.Quantity as quantity
            FROM Supplies su
            JOIN Store s ON su.StoreID = s.StoreID
            WHERE su.ProductID = %s AND su.Quantity > 0
        """
        availability = db.execute_query_with_column_names(availability_query, (product_id,))
        product_details['availability'] = availability
        
        return jsonify(product_details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/cart', methods=['GET'])
def get_cart():
    """Get user's shopping cart"""
    try:
        username = request.args.get('username')
        
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        query = """
            SELECT c.CartID as cartid, c.ProductID as productid, p.Name as product_name, 
                   p.Price as price, c.Quantity as quantity, 
                   (p.Price * c.Quantity) as total_price
            FROM Cart c
            JOIN Product p ON c.ProductID = p.ProductID
            WHERE c.Username = %s
        """
        cart_items = db.execute_query_with_column_names(query, (username,))
        
        # Calculate cart total
        total = sum(item['total_price'] for item in cart_items)
        
        return jsonify({
            "items": cart_items,
            "total": total
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    try:
        data = request.get_json()
        username = data.get('username')
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not all([username, product_id]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if item already in cart
        check_query = """
            SELECT CartID, Quantity FROM Cart 
            WHERE Username = %s AND ProductID = %s
        """
        existing = db.execute_query(check_query, (username, product_id))
        
        if existing:
            # Update quantity if item exists
            update_query = """
                UPDATE Cart
                SET Quantity = Quantity + %s
                WHERE CartID = %s
            """
            db.execute_query(update_query, (quantity, existing[0][0]), fetch=False)
        else:
            # Add new item to cart
            insert_query = """
                INSERT INTO Cart (Username, ProductID, Quantity)
                VALUES (%s, %s, %s)
            """
            db.execute_query(insert_query, (username, product_id, quantity), fetch=False)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/cart/remove', methods=['POST'])
def remove_from_cart():
    """Remove item from cart"""
    try:
        data = request.get_json()
        cart_id = data.get('cart_id')
        
        if not cart_id:
            return jsonify({"error": "Cart ID is required"}), 400
        
        delete_query = "DELETE FROM Cart WHERE CartID = %s"
        db.execute_query(delete_query, (cart_id,), fetch=False)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/cart/update', methods=['POST'])
def update_cart_quantity():
    """Update item quantity in cart"""
    try:
        data = request.get_json()
        cart_id = data.get('cart_id')
        quantity = data.get('quantity')
        
        if not all([cart_id, quantity]):
            return jsonify({"error": "Missing required fields"}), 400
        
        if int(quantity) <= 0:
            # Remove item if quantity is 0 or less
            delete_query = "DELETE FROM Cart WHERE CartID = %s"
            db.execute_query(delete_query, (cart_id,), fetch=False)
        else:
            # Update quantity
            update_query = "UPDATE Cart SET Quantity = %s WHERE CartID = %s"
            db.execute_query(update_query, (quantity, cart_id), fetch=False)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500 