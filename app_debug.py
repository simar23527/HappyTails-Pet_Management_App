from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import logging
import traceback
import psycopg2

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app_debug.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Database settings
db_host = 'localhost'
db_name = 'data'
db_user = 'postgres'
db_password = 'simar232'
db_port = '5432'

@app.route('/')
def index():
    logger.info("Root endpoint called")
    return jsonify({"message": "Welcome to Happy Tales API Debug"})

@app.route('/api/test')
def test():
    logger.info("Test endpoint called")
    return jsonify({"message": "API test endpoint is working"})

@app.route('/api/test-db')
def test_db():
    """Test database connection"""
    logger.info("Database test endpoint called")
    try:
        # Connect to the database
        connection = psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password,
            port=db_port
        )
        logger.info("Database connection successful")
        
        cursor = connection.cursor()
        
        # Check if table exists
        cursor.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')")
        table_exists = cursor.fetchone()[0]
        logger.info(f"users table exists: {table_exists}")
        
        # Get table names
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"Tables in database: {tables}")
        
        # Check for pettype table data
        if 'pettype' in tables or 'PetType' in tables:
            try:
                cursor.execute("SELECT COUNT(*) FROM pettype")
                pet_type_count = cursor.fetchone()[0]
                logger.info(f"Number of pet types: {pet_type_count}")
            except Exception as e:
                logger.error(f"Error checking pettype table: {e}")
                try:
                    cursor.execute("SELECT COUNT(*) FROM PetType")
                    pet_type_count = cursor.fetchone()[0]
                    logger.info(f"Number of pet types (uppercase): {pet_type_count}")
                except Exception as e:
                    logger.error(f"Error checking PetType table: {e}")
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "database": db_name,
            "users_table_exists": table_exists,
            "tables": tables
        })
    except Exception as e:
        logger.error(f"Database error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5002) 