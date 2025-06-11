from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from services.database import Database

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://*.vercel.app", "*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize database
db = Database()

# ROOT ROUTES
@app.route('/')
def index():
    print("=== ROOT ROUTE CALLED ===")
    return jsonify({"message": "Welcome to Happy Tales API"})

@app.route('/test-db')
def test_db():
    try:
        query = "SELECT * FROM PetType"
        result = db.execute_query_with_column_names(query)
        return jsonify({
            "status": "success",
            "message": "Database connection successful", 
            "pet_types": result
        })
    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/test-simple')
def test_simple():
    print("=== SIMPLE TEST ENDPOINT CALLED ===")
    return jsonify({"message": "Simple test endpoint works", "status": "success"})

# PET ROUTES
@app.route('/api/pets/types', methods=['GET'])
def get_pet_types():
    print("=== PET TYPES ENDPOINT CALLED ===")
    try:
        query = """
            SELECT 
                PetTypeID as id,
                PetTypeName as name
            FROM PetType
            ORDER BY PetTypeName
        """
        print(f"Executing query: {query}")
        pet_types = db.execute_query_with_column_names(query)
        print(f"Query result: {pet_types}")
        
        # Add descriptions for the pet types
        for pet_type in pet_types:
            if pet_type['name'].lower() == 'dog':
                pet_type['description'] = 'Loyal companions ready to join your family'
            elif pet_type['name'].lower() == 'cat':
                pet_type['description'] = 'Independent and loving feline friends'
            elif pet_type['name'].lower() == 'fish':
                pet_type['description'] = 'Peaceful aquatic pets for your home'
            elif pet_type['name'].lower() == 'bird':
                pet_type['description'] = 'Colorful and cheerful avian companions'
            else:
                pet_type['description'] = 'Find your perfect companion'
                
        print(f"Returning response: {pet_types}")
        return jsonify(pet_types)
    except Exception as e:
        print(f"Error fetching pet types: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# VET ROUTES  
@app.route('/api/vets/states', methods=['GET'])
def get_vet_states():
    print("=== VET STATES ENDPOINT CALLED ===")
    try:
        query = """
            SELECT DISTINCT State as state
            FROM Vet
            ORDER BY State
        """
        states = db.execute_query_with_column_names(query)
        return jsonify(states)
    except Exception as e:
        print(f"Error fetching vet states: {str(e)}")
        return jsonify({"error": str(e)}), 500

# USER ROUTES
@app.route('/api/users/login', methods=['POST'])
def login():
    print("=== LOGIN ENDPOINT CALLED ===")
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400
            
        # Check user credentials
        query = """
            SELECT Username, Name, Email 
            FROM UserAccount 
            WHERE Username = %s AND Password = %s
        """
        user = db.execute_query_with_column_names(query, (username, password))
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
            
        user_data = user[0]
        return jsonify({
            "message": "Login successful",
            "username": user_data['username'],
            "name": user_data.get('name', ''),
            "email": user_data.get('email', '')
        })
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/register', methods=['POST'])
def register():
    print("=== REGISTER ENDPOINT CALLED ===")
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        name = data.get('name', '')
        phone = data.get('phone', '')
        address = data.get('address', '')
        city = data.get('city', '')
        state = data.get('state', '')
        
        if not all([username, password, email]):
            return jsonify({"error": "Username, password and email are required"}), 400
            
        # Check if user exists
        check_query = "SELECT Username FROM UserAccount WHERE Username = %s OR Email = %s"
        existing = db.execute_query(check_query, (username, email))
        
        if existing:
            return jsonify({"error": "Username or email already exists"}), 400
            
        # Create new user
        insert_query = """
            INSERT INTO UserAccount (Username, Password, Name, Email, PhoneNumber, Address, City, State)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        db.execute_query(insert_query, (username, password, name, email, phone, address, city, state), fetch=False)
        
        return jsonify({"message": "User registered successfully"})
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        # Initialize database on startup
        db.initialize_db()
        print("Database initialized successfully")
        print("Starting Flask server...")
        
        # Print all registered routes
        print("\n=== REGISTERED ROUTES ===")
        for rule in app.url_map.iter_rules():
            print(f"Route: {rule.rule} -> Methods: {rule.methods} -> Endpoint: {rule.endpoint}")
        print("=== END ROUTES ===\n")
        
        # Get port from environment variable for deployment
        port = int(os.environ.get('PORT', 5000))
        # Run the Flask application
        app.run(debug=False, host='0.0.0.0', port=port)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
        import traceback
        traceback.print_exc()

db_host = os.environ.get('DB_HOST', 'localhost')
db_name = os.environ.get('DB_NAME', 'Project')
db_user = os.environ.get('DB_USER', 'postgres')
db_password = os.environ.get('DB_PASSWORD', '23562')
db_port = os.environ.get('DB_PORT', '5432') 
