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
        
        # NEW: Test different approaches to get breeds
        # Test 1: Without WHERE clause - uppercase table name
        all_breeds_query_upper = """
            SELECT BreedID as id, BreedName as name, AverageLifespan as averagelifespan, PetTypeID
            FROM Breed 
            ORDER BY BreedName
            LIMIT 10
        """
        all_breeds_upper = db.execute_query_with_column_names(all_breeds_query_upper)
        
        # Test 1b: Without WHERE clause - lowercase table name
        all_breeds_query_lower = """
            SELECT breedid as id, breedname as name, averagelifespan as averagelifespan, pettypeid
            FROM breed 
            ORDER BY breedname
            LIMIT 10
        """
        all_breeds_lower = db.execute_query_with_column_names(all_breeds_query_lower)
        
        # Test 2: Test ORDER BY clause impact
        # Working query (SELECT * without ORDER BY)
        pettype_no_order_query = "SELECT * FROM PetType"
        pettype_no_order = db.execute_query_with_column_names(pettype_no_order_query)
        
        # Test with ORDER BY 
        pettype_with_order_query = "SELECT * FROM PetType ORDER BY PetTypeID"
        pettype_with_order = db.execute_query_with_column_names(pettype_with_order_query)
        
        # Test lowercase column names
        pettype_lower_query = """
            SELECT pettypeid, pettypename 
            FROM PetType 
            ORDER BY pettypeid
        """
        pettype_lower = db.execute_query_with_column_names(pettype_lower_query)
        
        # Test Breed with lowercase column names
        breed_lower_query = """
            SELECT breedid, breedname, pettypeid
            FROM Breed 
            ORDER BY breedid
            LIMIT 5
        """
        breed_lower = db.execute_query_with_column_names(breed_lower_query)
        

        
        # Check all tables
        tables_query = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """
        tables = db.execute_query_with_column_names(tables_query)
        
        return jsonify({
            "status": "success",
            "message": "Database connection successful",
            "database_tables": tables,
            "pet_types": pet_types,
            "total_breeds": breed_count[0] if breed_count else {"total_breeds": 0},
            "breeds_by_type": breeds_by_type,
            "all_breeds_upper": all_breeds_upper,
            "all_breeds_lower": all_breeds_lower,
            "pettype_no_order": pettype_no_order,
            "pettype_with_order": pettype_with_order,
            "pettype_lower": pettype_lower,
            "breed_lower": breed_lower
        })
    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/test-breeds/<int:pet_type_id>', methods=['GET'])
def test_breeds(pet_type_id):
    """Test breeds endpoint in app.py - should work like test-db"""
    try:
        db = Database()
        print(f"=== TEST BREEDS ENDPOINT ===")
        print(f"Pet Type ID: {pet_type_id}")
        
        # Use same approach as test-db endpoint
        query = """
            SELECT BreedID as id, BreedName as name, AverageLifespan as averagelifespan,
                   PetTypeID as pet_type_id
            FROM Breed 
            WHERE PetTypeID = %s
            ORDER BY BreedName
        """
        
        breeds = db.execute_query_with_column_names(query, (pet_type_id,))
        print(f"Direct query result: {breeds}")
        
        return jsonify(breeds)
        
    except Exception as e:
        print(f"Test breeds error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
        
@app.route('/debug-breeds/<int:pet_type_id>', methods=['GET'])
def debug_breeds(pet_type_id):
    """Debug endpoint to test breed queries"""
    try:
        from services.database import Database
        db = Database()
        
        # Test the exact query used in pet_routes.py
        print(f"=== DEBUG BREEDS ENDPOINT ===")
        print(f"Pet Type ID: {pet_type_id}")
        
        # First, let's check if pet type exists
        type_query = "SELECT * FROM PetType WHERE PetTypeID = %s"
        pet_type = db.execute_query_with_column_names(type_query, (pet_type_id,))
        print(f"Pet Type Query Result: {pet_type}")
        
        # Check breeds table structure
        structure_query = """
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'breed'
        """
        structure = db.execute_query_with_column_names(structure_query)
        print(f"Breed Table Structure: {structure}")
        
        # Test basic breed query
        basic_query = "SELECT * FROM Breed LIMIT 5"
        basic_breeds = db.execute_query_with_column_names(basic_query)
        print(f"Basic Breed Query (first 5): {basic_breeds}")
        
        # Test breed count by pet type
        count_query = """
            SELECT PetTypeID, COUNT(*) as breed_count 
            FROM Breed 
            GROUP BY PetTypeID
        """
        counts = db.execute_query_with_column_names(count_query)
        print(f"Breed counts by pet type: {counts}")
        
        # Test the exact problematic query
        problem_query = """
            SELECT b.BreedID as id, b.BreedName as name, b.AverageLifespan as averagelifespan, 
                   pt.PetTypeID as pet_type_id, pt.PetTypeName as pet_type_name
            FROM Breed b
            JOIN PetType pt ON b.PetTypeID = pt.PetTypeID
            WHERE b.PetTypeID = %s
        """
        problem_result = db.execute_query_with_column_names(problem_query, (pet_type_id,))
        print(f"Problem Query Result: {problem_result}")
        
        return jsonify({
            "pet_type": pet_type,
            "structure": structure,
            "basic_breeds": basic_breeds,
            "counts": counts,
            "problem_query_result": problem_result,
            "pet_type_id": pet_type_id
        })
        
    except Exception as e:
        print(f"Debug error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

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
