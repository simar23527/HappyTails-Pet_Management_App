import requests

def test_endpoint(url, description):
    try:
        response = requests.get(url)
        print(f"{description}: Status code: {response.status_code}")
        print(f"Response: {response.text[:200]}..." if len(response.text) > 200 else f"Response: {response.text}")
    except Exception as e:
        print(f"{description} Error: {e}")

# Test root endpoint
test_endpoint("http://localhost:5000/", "Root endpoint")

# Test pet types endpoint
test_endpoint("http://localhost:5000/api/pets/types", "Pet types endpoint")

# Test product categories endpoint
test_endpoint("http://localhost:5000/api/products/categories", "Product categories endpoint")

# Test vet listing endpoint
test_endpoint("http://localhost:5000/api/vets/list", "Vet listing endpoint") 