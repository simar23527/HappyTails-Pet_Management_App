from flask import Blueprint, jsonify, request
from services.database import Database

shopping_category_routes = Blueprint('shopping_category_routes', __name__)
db = Database()

@shopping_category_routes.route('/list', methods=['GET'])
def get_categories():
    """Get all shopping categories"""
    try:
        query = """
            SELECT CategoryID as id, CategoryName as name 
            FROM ShoppingCategory
            ORDER BY CategoryName
        """
        categories = db.execute_query_with_column_names(query)
        return jsonify(categories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@shopping_category_routes.route('/<int:category_id>/products', methods=['GET'])
def get_category_products(category_id):
    """Get all products in a specific category"""
    try:
        query = """
            SELECT p.ProductID as id, p.Name as name, p.Price as price,
                   pt.PetTypeName as pet_type,
                   sc.CategoryName as category
            FROM Product p
            JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID
            JOIN PetType pt ON p.PetTypeID = pt.PetTypeID
            WHERE p.CategoryID = %s
            ORDER BY p.Name
        """
        products = db.execute_query_with_column_names(query, (category_id,))
        
        if not products:
            return jsonify({"message": "No products found in this category"}), 404
            
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@shopping_category_routes.route('/<int:category_id>/stats', methods=['GET'])
def get_category_stats(category_id):
    """Get statistics for a specific category"""
    try:
        query = """
            SELECT 
                sc.CategoryName as category,
                COUNT(p.ProductID) as total_products,
                AVG(p.Price) as average_price,
                MIN(p.Price) as min_price,
                MAX(p.Price) as max_price,
                COUNT(DISTINCT p.PetTypeID) as pet_type_count
            FROM ShoppingCategory sc
            LEFT JOIN Product p ON sc.CategoryID = p.CategoryID
            WHERE sc.CategoryID = %s
            GROUP BY sc.CategoryName
        """
        stats = db.execute_query_with_column_names(query, (category_id,))
        
        if not stats:
            return jsonify({"error": "Category not found"}), 404
            
        return jsonify(stats[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@shopping_category_routes.route('/search', methods=['GET'])
def search_products_by_category():
    """Search products within categories with filters"""
    try:
        category_id = request.args.get('category_id')
        pet_type_id = request.args.get('pet_type_id')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        search_term = request.args.get('search', '')
        
        query = """
            SELECT p.ProductID as id, p.Name as name, p.Price as price,
                   sc.CategoryName as category,
                   pt.PetTypeName as pet_type
            FROM Product p
            JOIN ShoppingCategory sc ON p.CategoryID = sc.CategoryID
            JOIN PetType pt ON p.PetTypeID = pt.PetTypeID
            WHERE 1=1
        """
        params = []
        
        if category_id:
            query += " AND p.CategoryID = %s"
            params.append(int(category_id))
        
        if pet_type_id:
            query += " AND p.PetTypeID = %s"
            params.append(int(pet_type_id))
        
        if min_price:
            query += " AND p.Price >= %s"
            params.append(float(min_price))
        
        if max_price:
            query += " AND p.Price <= %s"
            params.append(float(max_price))
        
        if search_term:
            query += " AND p.Name ILIKE %s"
            params.append(f'%{search_term}%')
        
        query += " ORDER BY p.Name"
        
        products = db.execute_query_with_column_names(query, tuple(params))
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500 