from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from services.database import Database

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000", 
            "https://happy-tails-pet-management-app.vercel.app",
            "https://*.vercel.app", 
            "*"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
        "supports_credentials": True
    }
})

# Import and register route blueprints
try:
    from routes.pet_routes import pet_routes
    from routes.product_routes import product_routes
    from routes.vet_routes import vet_routes
    from routes.user_routes import user_routes
    from routes.order_routes import order_routes
    from routes.shopping_category_routes import shopping_category_routes
    
    app.register_blueprint(pet_routes, url_prefix='/api/pets')
    app.register_blueprint(product_routes, url_prefix='/api/products')
    app.register_blueprint(vet_routes, url_prefix='/api/vets')
    app.register_blueprint(user_routes, url_prefix='/api/users')
    app.register_blueprint(order_routes, url_prefix='/api/orders')
    app.register_blueprint(shopping_category_routes, url_prefix='/api/shopping-categories')
    
    print("All blueprints registered successfully!")
    
except Exception as e:
    print(f"Error importing/registering blueprints: {e}")
    import traceback
    traceback.print_exc()

@app.route('/')
def index():
    from flask import make_response
    response = make_response(jsonify({
        "message": "Happy Tales API - CORS Fixed v3.2", 
        "status": "working",
        "timestamp": f"{os.environ.get('PORT', '5000')}",
        "endpoints": {
            "health": "/health",
            "test": "/api/test-direct",
            "auth": "/api/users/login and /api/users/register"
        }
    }))
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "api_version": "2.2"})

@app.before_request
def log_request_info():
    print(f"Request: {request.method} {request.url}")
    print(f"Endpoint: {request.endpoint}")

@app.route('/api/test-direct')
def test_direct():
    return jsonify({
        "message": "DIRECT ROUTE WORKS!",
        "status": "success",
        "test": "This route is in app.py, not a blueprint"
    })

@app.route('/test-db')
def test_db():
    try:
        db = Database()
        # Test pet types
        pet_types_query = "SELECT * FROM PetType"
        pet_types = db.execute_query_with_column_names(pet_types_query)
        
        # Test breeds
        breeds_query = "SELECT COUNT(*) as total_breeds FROM Breed"
        breed_count = db.execute_query_with_column_names(breeds_query)
        
        # Test breeds by pet type
        breeds_by_type_query = """
            SELECT pt.PetTypeName, COUNT(b.BreedID) as breed_count
            FROM PetType pt
            LEFT JOIN Breed b ON pt.PetTypeID = b.PetTypeID
            GROUP BY pt.PetTypeID, pt.PetTypeName
        """
        breeds_by_type = db.execute_query_with_column_names(breeds_by_type_query)
        
        return jsonify({
            "status": "success",
            "message": "Database connection successful",
            "pet_types": pet_types,
            "total_breeds": breed_count[0] if breed_count else {"total_breeds": 0},
            "breeds_by_type": breeds_by_type
        })
    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    try:
        # Initialize database on startup
        db = Database()
        db.initialize_db()
        
        print("Starting Flask server...")
        
        # Print all registered routes for debugging
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
