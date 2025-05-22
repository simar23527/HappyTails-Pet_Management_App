from flask import Blueprint, jsonify, request
from services.database import Database

query_routes = Blueprint('query_routes', __name__)
db = Database()

@query_routes.route('/all', methods=['GET'])
def get_all_queries():
    """Get all predefined queries with descriptions"""
    query_data = {}
    
    with open('data/queries.sql', 'r') as file:
        content = file.read()
        sections = content.split('--')
        
        current_query_id = 0
        for i in range(1, len(sections)):
            section = sections[i].strip()
            if not section:
                continue
                
            lines = section.split('\n')
            description = lines[0].strip()
            
            # Skip ALTER TABLE statements
            if 'ALTER TABLE' in '\n'.join(lines[1:]) or 'ADD COLUMN' in '\n'.join(lines[1:]):
                continue
                
            # Create a query only if there's SQL code
            if len(lines) > 1 and any(keyword in '\n'.join(lines[1:]).upper() for keyword in ['SELECT', 'INSERT', 'UPDATE', 'DELETE']):
                query_sql = '\n'.join(lines[1:]).strip()
                
                if query_sql:
                    current_query_id += 1
                    query_data[current_query_id] = {
                        'id': current_query_id,
                        'description': description,
                        'sql': query_sql
                    }
    
    return jsonify(query_data)

@query_routes.route('/execute/<int:query_id>', methods=['GET'])
def execute_query(query_id):
    """Execute a predefined query by ID"""
    queries = {}
    
    with open('data/queries.sql', 'r', encoding='utf-8') as file:
        content = file.read()
        sections = content.split('--')
        
        current_query_id = 0
        for i in range(1, len(sections)):
            section = sections[i].strip()
            if not section:
                continue
                
            lines = section.split('\n')
            description = lines[0].strip()
            
            # Skip ALTER TABLE statements
            if 'ALTER TABLE' in '\n'.join(lines[1:]) or 'ADD COLUMN' in '\n'.join(lines[1:]):
                continue
                
            # Create a query only if there's SQL code
            if len(lines) > 1 and any(keyword in '\n'.join(lines[1:]).upper() for keyword in ['SELECT', 'INSERT', 'UPDATE', 'DELETE']):
                query_sql = '\n'.join(lines[1:]).strip()
                
                if query_sql:
                    current_query_id += 1
                    queries[current_query_id] = {
                        'id': current_query_id,
                        'description': description,
                        'sql': query_sql
                    }
    
    if query_id not in queries:
        return jsonify({'error': f'Query not found with ID {query_id}'}), 404
    
    query = queries[query_id]['sql']
    description = queries[query_id]['description']
    
    # Clean up any trailing semicolons or formatting issues that might affect the query
    query = query.strip()
    if query.endswith(';'):
        # Ensure query doesn't end with a semicolon as it can cause issues with parameters
        query = query[:-1]
    
    try:
        # Detailed logging
        print(f"=== EXECUTING QUERY ID {query_id} ===")
        print(f"Description: {description}")
        print(f"SQL: {query}")
        
        # Check if this is a shopping category query and print more debug info
        if "shopping category" in description.lower() or "categoryname ilike" in query.lower():
            print("DETECTED SHOPPING CATEGORY QUERY")
            print("Checking database for ShoppingCategory values")
            categories = db.execute_query_with_column_names("SELECT CategoryID, CategoryName FROM ShoppingCategory")
            print(f"Available categories in database: {categories}")
            
            # Check for products related to treats
            products = db.execute_query_with_column_names(
                "SELECT p.ProductID, p.Name, sc.CategoryName FROM Product p " +
                "JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID " +
                "WHERE sc.CategoryName ILIKE '%Treat%'"
            )
            print(f"Products with 'Treat' in category name: {products}")
        
        # Execute query and get results with column names
        results = db.execute_query_with_column_names(query)
        
        print(f"Query returned {len(results)} results")
        if results:
            print(f"First result: {results[0]}")
        else:
            print("No results returned")
        
        return jsonify({
            'id': query_id,
            'description': description,
            'sql': query,
            'results': results
        })
    except Exception as e:
        error_message = str(e)
        print(f"ERROR executing query: {error_message}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'id': query_id,
            'description': description,
            'sql': query,
            'error': error_message,
            'results': []
        }), 500 