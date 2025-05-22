from flask import Blueprint, jsonify, request
from services.database import Database
import requests

pet_routes = Blueprint('pet_routes', __name__)
db = Database()

@pet_routes.route('/types', methods=['GET'])
def get_pet_types():
    """Get all pet types"""
    try:
        query = """
            SELECT 
                PetTypeID as id,
                PetTypeName as name
            FROM PetType
            ORDER BY PetTypeName
        """
        pet_types = db.execute_query_with_column_names(query)
        
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
                
        return jsonify(pet_types)
    except Exception as e:
        print(f"Error fetching pet types: {str(e)}")  # Debug logging
        return jsonify({"error": str(e)}), 500

@pet_routes.route('/types/<int:pet_type_id>/breeds', methods=['GET'])
def get_breeds_by_pet_type(pet_type_id):
    """Get all breeds for a specific pet type"""
    try:
        query = """
            SELECT b.BreedID as id, b.BreedName as name, b.AverageLifespan as averagelifespan, 
                   pt.PetTypeID as pet_type_id, pt.PetTypeName as pet_type_name,
                   b.ImageURL as imageurl
            FROM Breed b
            JOIN PetType pt ON b.PetTypeID = pt.PetTypeID
            WHERE b.PetTypeID = %s
        """
        breeds = db.execute_query_with_column_names(query, (pet_type_id,))
        return jsonify(breeds)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pet_routes.route('/breeds/<int:breed_id>', methods=['GET'])
def get_breed_details(breed_id):
    """Get details for a specific breed"""
    try:
        # Query to get breed details
        query = """
            SELECT b.BreedID as id, b.BreedName as name, b.AverageLifespan as averagelifespan, 
                   pt.PetTypeID as pet_type_id, pt.PetTypeName as pet_type_name
            FROM Breed b
            JOIN PetType pt ON b.PetTypeID = pt.PetTypeID
            WHERE b.BreedID = %s
        """
        breeds = db.execute_query_with_column_names(query, (breed_id,))
        
        if not breeds:
            return jsonify({"error": "Breed not found"}), 404
        
        breed_details = breeds[0]
        
        # Query to get store availability for this breed
        availability_query = """
            SELECT s.StoreID as storeid, s.Name as store_name, s.Address as address, s.ContactNumber as contactnumber, 
                   s.City as city, s.State as state, a.Available as available
            FROM Availability a
            JOIN Store s ON a.StoreID = s.StoreID
            WHERE a.BreedID = %s AND a.Available > 0
        """
        availability = db.execute_query_with_column_names(availability_query, (breed_id,))
        breed_details['availability'] = availability
        
        return jsonify(breed_details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pet_routes.route('/available', methods=['GET'])
def get_available_pets():
    """Get all available pets (for adoption page)"""
    try:
        query = """
            SELECT a.BreedID as breedid, b.BreedName as breedname, pt.PetTypeName as pettypename, 
                   SUM(a.Available) as total_available
            FROM Availability a
            JOIN Breed b ON a.BreedID = b.BreedID
            JOIN PetType pt ON b.PetTypeID = pt.PetTypeID
            GROUP BY a.BreedID, b.BreedName, pt.PetTypeName
            HAVING SUM(a.Available) > 0
            ORDER BY total_available DESC
        """
        available_pets = db.execute_query_with_column_names(query)
        return jsonify(available_pets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pet_routes.route('/breeds/<int:breed_id>/image', methods=['GET'])
def get_breed_image(breed_id):
    """Get or update image for a specific breed"""
    try:
        # Get breed information
        breed_query = """
            SELECT b.BreedName, p.PetTypeName 
            FROM Breed b
            JOIN PetType p ON b.PetTypeID = p.PetTypeID
            WHERE b.BreedID = %s
        """
        breed_info = db.execute_query_with_column_names(breed_query, (breed_id,))
        
        if not breed_info:
            return jsonify({"error": "Breed not found"}), 404
            
        breed = breed_info[0]
        breed_name = breed['breedname'].lower()
        pet_type = breed['pettypename'].lower()
        
        # Check if we already have an image URL
        if breed.get('imageurl'):
            return jsonify({"image_url": breed['imageurl']})
            
        # Fetch image based on pet type
        image_url = None
        if pet_type == 'dog':
            # Use Dog CEO API
            response = requests.get(f'https://dog.ceo/api/breed/{breed_name}/images/random')
            if response.status_code == 200:
                image_url = response.json()['message']
        elif pet_type == 'cat':
            # Use TheCatAPI
            response = requests.get(f'https://api.thecatapi.com/v1/images/search?breed_ids={breed_name}')
            if response.status_code == 200 and response.json():
                image_url = response.json()[0]['url']
        # Add more pet types as needed
        
        if image_url:
            # Update the breed with the new image URL
            update_query = """
                UPDATE Breed
                SET ImageURL = %s
                WHERE BreedID = %s
            """
            db.execute_query(update_query, (image_url, breed_id), fetch=False)
            
        return jsonify({
            "image_url": image_url or "default-breed.jpg"
        })
        
    except Exception as e:
        print(f"Error fetching breed image: {str(e)}")
        return jsonify({"error": str(e)}), 500 


@pet_routes.route('/adopt', methods=['POST'])
def adopt_pet():
    """Adopt a pet"""
    try:
        data = request.get_json()
        username = data.get('username')
        breed_id = data.get('breed_id')
        store_id = data.get('store_id')
        
        if not all([username, breed_id, store_id]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if the pet is available in the specified store
        availability_query = """
            SELECT Available FROM Availability 
            WHERE BreedID = %s AND StoreID = %s
        """
        availability = db.execute_query(availability_query, (breed_id, store_id))
        
        if not availability or availability[0][0] <= 0:
            return jsonify({"error": "Pet not available at this store"}), 400
        
        # Create a new pet record
        create_pet_query = """
            INSERT INTO Pet (PetTypeID, Gender, Age, BreedID, Owner)
            SELECT b.PetTypeID, 
                   CASE WHEN random() > 0.5 THEN 'Male' ELSE 'Female' END,
                   CEILING(random() * 5), 
                   %s, 
                   %s
            FROM Breed b
            WHERE b.BreedID = %s
            RETURNING PetID
        """
        pet_id = db.execute_query(create_pet_query, (breed_id, username, breed_id))
        
        if not pet_id:
            return jsonify({"error": "Failed to create pet record"}), 500
        
        # Create adoption record
        adoption_query = """
            INSERT INTO Adoption (Username, PetID)
            VALUES (%s, %s)
        """
        db.execute_query(adoption_query, (username, pet_id[0][0]), fetch=False)
        
        # Update availability
        update_query = """
            UPDATE Availability
            SET Available = Available - 1
            WHERE BreedID = %s AND StoreID = %s
        """
        db.execute_query(update_query, (breed_id, store_id), fetch=False)
        
        return jsonify({"success": True, "pet_id": pet_id[0][0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pet_routes.route('/breeds/<int:breed_id>/stores', methods=['GET'])
def get_available_stores_for_breed(breed_id):
    """Get stores where a specific breed is available"""
    try:
        query = """
            SELECT s.StoreID as id, s.Name as name, s.Address as address, 
                   s.ContactNumber as contactnumber, s.City as city, s.State as state,
                   a.Available as available
            FROM Availability a
            JOIN Store s ON a.StoreID = s.StoreID
            WHERE a.BreedID = %s AND a.Available > 0
            ORDER BY s.Name
        """
        stores = db.execute_query_with_column_names(query, (breed_id,))
        return jsonify(stores)
    except Exception as e:
        return jsonify({"error": str(e)}), 500 