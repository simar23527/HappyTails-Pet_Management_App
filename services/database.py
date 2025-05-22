import psycopg2
import os
import traceback
from psycopg2 import pool

class Database:
    _connection_pool = None
    
    def __init__(self):
        if Database._connection_pool is None:
            # Default to localhost if environment variables are not set
            db_host = os.environ.get('DB_HOST', 'localhost')
            db_name = os.environ.get('DB_NAME', 'data')  # Changed from 'data' to 'Project'
            db_user = os.environ.get('DB_USER', 'postgres')
            db_password = os.environ.get('DB_PASSWORD', 'simar232')  # Changed from 'simar232' to '23562'
            db_port = os.environ.get('DB_PORT', '5432')
            
            # Create a connection pool
            Database._connection_pool = pool.ThreadedConnectionPool(
                1, 20,
                host=db_host,
                database=db_name,
                user=db_user,
                password=db_password,
                port=db_port
            )
            print("PostgreSQL connection pool created successfully")
    
    def get_connection(self):
        """Get a connection from the connection pool"""
        return Database._connection_pool.getconn()
    
    def return_connection(self, connection):
        """Return a connection to the connection pool"""
        Database._connection_pool.putconn(connection)
    
    def initialize_db(self):
        """Check if database is properly set up, but don't recreate tables if they exist"""
        try:
            # Get a connection from the pool
            connection = self.get_connection()
            cursor = connection.cursor()
            
            # Check if tables exist by querying a key table
            cursor.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')")
            table_exists = cursor.fetchone()[0]
            
            if not table_exists:
                print("Database tables do not exist. Creating from data.sql...")
                # Read the SQL file
                with open('data/data.sql', 'r') as sql_file:
                    sql_script = sql_file.read()
                    
                # Execute the SQL script
                cursor.execute(sql_script)
                connection.commit()
                print("Database initialized successfully!")
            else:
                print("Database tables already exist. Skipping initialization.")
            
        except Exception as e:
            print(f"Error initializing database: {e}")
            traceback.print_exc()
        finally:
            # Close cursor and return connection to the pool
            if cursor:
                cursor.close()
            if connection:
                self.return_connection(connection)
    
    def execute_query(self, query, params=None, fetch=True):
        """Execute a query and optionally fetch results"""
        connection = None
        cursor = None
        result = None
        
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            
            cursor.execute(query, params or ())
            
            if fetch:
                result = cursor.fetchall()
            else:
                connection.commit()
                result = cursor.rowcount
                
            return result
        except Exception as e:
            if connection:
                connection.rollback()
            print(f"Database error: {e}")
            traceback.print_exc()
            return None
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.return_connection(connection)
                
    def execute_query_with_column_names(self, query, params=None):
        """Execute a query and return results with column names"""
        connection = None
        cursor = None
        result = None
        
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            
            cursor.execute(query, params or ())
            
            # Get column names from cursor description
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            
            # Convert to list of dictionaries
            result = []
            for row in rows:
                result.append(dict(zip(columns, row)))
                
            return result
        except Exception as e:
            if connection:
                connection.rollback()
            print(f"Database error: {e}")
            traceback.print_exc()
            return []
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.return_connection(connection) 