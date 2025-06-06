# Happy Tales Pet Store Application

This is a full-stack application for a pet store with features including pet adoption, product shopping, and vet services.
cd C:\Users\DELL\Downloads\HappyTails-Pet_Management_App-main\HappyTails-Pet_Management_App-main

## Project Structure

- `/pages`: Frontend React/Next.js components
- `/data`: Database SQL schema and API service
- `/routes`: Backend API routes
- `/services`: Backend services

## Setup Instructions

### Database Setup
1. Install PostgreSQL if not already installed.
2. Create a new database for the application.
3. Initialize the database with the schema in `data/data.sql`.

```bash
psql -U postgres -c "CREATE DATABASE happy_tails"
psql -U postgres -d happy_tails -f data/data.sql
```

### Backend Setup
1. Make sure Python 3.8+ is installed.
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables (optional):
```bash
# Database connection
export DB_HOST=localhost
export DB_NAME=happy_tails
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_PORT=5432
```

4. Run the Flask application:
```bash
python app.py
```

The backend will be running at http://localhost:5000.

### Frontend Setup
1. Make sure Node.js and npm are installed.
2. Install the required dependencies:

```bash
npm install
```

3. Set the environment variable for the API URL:
```bash
# Create or edit .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

4. Run the Next.js development server:
```bash
npm run dev
```

The frontend will be running at http://localhost:3000.

## API Endpoints

### Pet Routes
- `GET /api/pets/types`: Get all pet types
- `GET /api/pets/types/:id/breeds`: Get all breeds for a pet type
- `GET /api/pets/breeds/:id`: Get details for a specific breed
- `GET /api/pets/available`: Get available pets for adoption
- `POST /api/pets/adopt`: Adopt a pet

### Product Routes
- `GET /api/products/categories`: Get all product categories
- `GET /api/products/list`: Get list of products with optional filtering
- `GET /api/products/:id`: Get details for a specific product
- `GET /api/products/cart`: Get user's shopping cart
- `POST /api/products/cart/add`: Add item to cart
- `POST /api/products/cart/remove`: Remove item from cart
- `POST /api/products/cart/update`: Update item quantity in cart

### Vet Routes
- `GET /api/vets/list`: Get list of vets with optional filtering
- `GET /api/vets/:id`: Get details for a specific vet
- `GET /api/vets/cities`: Get list of cities with vets
- `GET /api/vets/states`: Get list of states with vets

### User Routes
- `POST /api/users/login`: Login a user
- `POST /api/users/register`: Register a new user
- `GET /api/users/profile/:username`: Get user profile
- `PUT /api/users/profile/:username`: Update user profile

### Order Routes
- `GET /api/orders/history/:username`: Get order history for a user
- `GET /api/orders/:id`: Get details for a specific order
- `POST /api/orders/place`: Place a new order
- `PUT /api/orders/:id/status`: Update order status 
