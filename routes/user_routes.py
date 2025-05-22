from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from services.database import Database

user_routes = Blueprint('user_routes', __name__)
db = Database()

@user_routes.route('/login', methods=['POST'])
def login():
    """Login a user"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not all([username, password]):
            return jsonify({"error": "Missing credentials"}), 400
        
        # Get user from database - only check username and password
        query = """
            SELECT Username 
            FROM Users 
            WHERE Username = %s AND Password = %s
        """
        users = db.execute_query_with_column_names(query, (username, password))
        
        if not users:
            return jsonify({"error": "Invalid credentials"}), 401
            
        # Simplified response with just username and success message
        return jsonify({
            "message": "Login successful",
            "username": username
        }), 200
            
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 500

@user_routes.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not all([username, password, email]):
            return jsonify({"error": "Missing required fields"}), 400

        # Check if username already exists
        check_query = "SELECT Username FROM Users WHERE Username = %s"
        existing_user = db.execute_query(check_query, (username,))

        if existing_user:
            return jsonify({"error": "Username already exists"}), 400

        # Insert new user
        insert_query = """
            INSERT INTO Users (Username, Password, Email)
            VALUES (%s, %s, %s)
        """
        db.execute_query(insert_query, (username, password, email), fetch=False)

        return jsonify({"message": "Registration successful"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_routes.route('/profile/<username>', methods=['GET'])
def get_profile(username):
    """Get user profile information"""
    try:
        # Get user details
        query = """
            SELECT Username, Email
            FROM Users
            WHERE Username = %s
        """
        users = db.execute_query_with_column_names(query, (username,))
        
        if not users:
            return jsonify({"error": "User not found"}), 404
            
        user = users[0]
        
        # Get user's orders
        orders_query = """
            SELECT o.OrderID, o.OrderDate, o.Status,
                   COUNT(od.ProductID) as ItemCount,
                   SUM(p.Price * od.Quantity) as TotalAmount
            FROM Orders o
            JOIN OrderDetails od ON o.OrderID = od.OrderID
            JOIN Product p ON od.ProductID = p.ProductID
            WHERE o.Username = %s
            GROUP BY o.OrderID, o.OrderDate, o.Status
            ORDER BY o.OrderDate DESC
        """
        orders = db.execute_query_with_column_names(orders_query, (username,))
        
        # Get user's pets
        pets_query = """
            SELECT p.PetID, pt.PetTypeName as pet_type, p.Gender, p.Age,
                   b.BreedName as breed
            FROM Pet p
            JOIN PetType pt ON p.PetTypeID = pt.PetTypeID
            JOIN Breed b ON p.BreedID = b.BreedID
            WHERE p.Owner = %s
        """
        pets = db.execute_query_with_column_names(pets_query, (username,))
        
        # Add orders and pets to user data
        user['orders'] = orders
        user['pets'] = pets
        
        return jsonify(user)
        
    except Exception as e:
        print(f"Error getting profile: {str(e)}")
        return jsonify({"error": str(e)}), 500

@user_routes.route('/profile/<username>', methods=['PUT'])
def update_profile(username):
    """Update user profile"""
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        address = data.get('address')
        city = data.get('city')
        state = data.get('state')
        password = data.get('password')  # Optional password change
        
        # Check for required fields
        if not all([name, email, phone, city]):
            return jsonify({"error": "Required fields missing"}), 400
        
        # Check if email or phone already exists for another user
        check_query = """
            SELECT Username FROM Users 
            WHERE (Email = %s OR Phone = %s) AND Username != %s
        """
        existing = db.execute_query(check_query, (email, phone, username))
        
        if existing:
            return jsonify({"error": "Email or phone already in use by another user"}), 400
        
        # Build update query based on whether password is being changed
        if password:
            update_query = """
                UPDATE Users
                SET Name = %s, Email = %s, Phone = %s, Address = %s, 
                    City = %s, State = %s, Password = %s
                WHERE Username = %s
            """
            params = (name, email, phone, address, city, state, password, username)
        else:
            update_query = """
                UPDATE Users
                SET Name = %s, Email = %s, Phone = %s, Address = %s, 
                    City = %s, State = %s
                WHERE Username = %s
            """
            params = (name, email, phone, address, city, state, username)
        
        db.execute_query(update_query, params, fetch=False)
        
        return jsonify({
            "success": True,
            "username": username
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500 