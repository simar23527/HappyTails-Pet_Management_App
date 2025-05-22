from flask import Blueprint, jsonify, request
from services.database import Database

vet_routes = Blueprint('vet_routes', __name__)
db = Database()

@vet_routes.route('/list', methods=['GET'])
def get_vet_list():
    """Get list of vets with optional filtering"""
    try:
        # Get filter parameters
        city = request.args.get('city')
        state = request.args.get('state')
        rating = request.args.get('rating')
        
        # Build query with placeholders
        query = """
            SELECT VetID as id, Name as name, ContactNumber as contactnumber, Address as address, City as city, State as state,
                   Rating as rating, OpeningTime as openingtime, ClosingTime as closingtime
            FROM Vet
            WHERE 1=1
        """
        
        # Initialize params list
        params = []
        
        # Add filters if provided
        if city:
            query += " AND City ILIKE %s"
            params.append(f'%{city}%')
        
        if state:
            query += " AND State = %s"
            params.append(state)
        
        if rating:
            query += " AND Rating >= %s"
            params.append(float(rating))
        
        # Add ordering
        query += " ORDER BY Rating DESC, Name"
        
        vets = db.execute_query_with_column_names(query, tuple(params))
        
        # Convert time objects to strings for JSON serialization
        for vet in vets:
            if vet.get('openingtime'):
                vet['openingtime'] = str(vet['openingtime'])
            if vet.get('closingtime'):
                vet['closingtime'] = str(vet['closingtime'])
        
        return jsonify(vets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vet_routes.route('/<int:vet_id>', methods=['GET'])
def get_vet_details(vet_id):
    """Get details for a specific vet"""
    try:
        query = """
            SELECT VetID as id, Name as name, ContactNumber as contactnumber, Address as address, City as city, State as state,
                   Rating as rating, OpeningTime as openingtime, ClosingTime as closingtime
            FROM Vet
            WHERE VetID = %s
        """
        vets = db.execute_query_with_column_names(query, (vet_id,))
        
        if not vets:
            return jsonify({"error": "Vet not found"}), 404
        
        vet_details = vets[0]
        
        # Convert time objects to strings for JSON serialization
        if vet_details.get('openingtime'):
            vet_details['openingtime'] = str(vet_details['openingtime'])
        if vet_details.get('closingtime'):
            vet_details['closingtime'] = str(vet_details['closingtime'])
        
        # Add available services (mock data since we don't have services table)
        vet_details['services'] = [
            {"id": 1, "name": "General Check-up", "price": 50.00},
            {"id": 2, "name": "Vaccination", "price": 35.00},
            {"id": 3, "name": "Dental Cleaning", "price": 80.00},
            {"id": 4, "name": "Microchipping", "price": 45.00},
            {"id": 5, "name": "Spay/Neuter", "price": 150.00}
        ]
        
        return jsonify(vet_details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vet_routes.route('/cities', methods=['GET'])
def get_cities():
    """Get list of cities with vets for filtering"""
    try:
        query = """
            SELECT DISTINCT City
            FROM Vet
            ORDER BY City
        """
        cities = db.execute_query(query)
        return jsonify([city[0] for city in cities])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vet_routes.route('/states', methods=['GET'])
def get_states():
    """Get list of states with vets for filtering"""
    try:
        query = """
            SELECT DISTINCT State
            FROM Vet
            ORDER BY State
        """
        states = db.execute_query(query)
        return jsonify([state[0] for state in states])
    except Exception as e:
        return jsonify({"error": str(e)}), 500 