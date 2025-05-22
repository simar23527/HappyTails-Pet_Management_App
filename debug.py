import sys
print("Python Interpreter Path:", sys.executable)
from flask import Flask, jsonify, request, g
import traceback
import os
import psycopg2
from psycopg2 import pool

app = Flask(__name__)

# Database settings
db_host = 'localhost'
db_name = 'data'
db_user = 'postgres'
db_password = 'Simar232'
db_port = '5432'

# Create a connection pool
connection_pool = None
try:
    connection_pool = psycopg2.pool.ThreadedConnectionPool(
        1, 5,
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_password,
        port=db_port
    )
    print("PostgreSQL connection pool created successfully")
except Exception as e:
    print(f"Error creating connection pool: {e}")
    traceback.print_exc()

@app.before_request
def before_request():
    """Get a database connection for each request"""
    try:
        g.db_conn = connection_pool.getconn() if connection_pool else None
        g.db_cursor = g.db_conn.cursor() if g.db_conn else None
        print(f"Request received: {request.method} {request.url}")
    except Exception as e:
        print(f"Error getting connection: {e}")
        traceback.print_exc()

@app.teardown_request
def teardown_request(exception):
    """Return the database connection to the pool after each request"""
    if hasattr(g, 'db_cursor') and g.db_cursor:
        g.db_cursor.close()
    if hasattr(g, 'db_conn') and g.db_conn and connection_pool:
        connection_pool.putconn(g.db_conn)

@app.route('/')
def index():
    """Root endpoint"""
    return jsonify({"message": "Debug API server is running"})

@app.route('/api/test-db')
def test_db():
    """Test database connection"""
    try:
        if not g.db_cursor:
            return jsonify({"error": "No database connection"}), 500
            
        # Check if table exists
        g.db_cursor.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')")
        table_exists = g.db_cursor.fetchone()[0]
        
        # Get table names
        g.db_cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        tables = [row[0] for row in g.db_cursor.fetchall()]
        
        return jsonify({
            "success": True,
            "database": db_name,
            "users_table_exists": table_exists,
            "tables": tables
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

@app.route('/api/pets/types')
def get_pet_types():
    """Get all pet types"""
    try:
        if not g.db_cursor:
            return jsonify({"error": "No database connection"}), 500
            
        g.db_cursor.execute("SELECT pettypeid as id, pettypename as name FROM pettype")
        
        columns = [desc[0] for desc in g.db_cursor.description]
        pet_types = [dict(zip(columns, row)) for row in g.db_cursor.fetchall()]
        
        return jsonify(pet_types)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

if __name__ == '__main__':
    # Run the Flask application
    app.run(debug=True, host='0.0.0.0', port=5001) 