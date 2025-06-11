import axios from 'axios';

// Use Next.js API routes instead of direct backend calls
const API_URL = '/api';

console.log('API URL:', API_URL); // Debug log

// Create axios instance with base URL and timeout
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
  console.log('Making request to:', request.url);
  return request;
});

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('Received response:', response.status);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
);

// Authentication Services
export const login = async (username: string, password: string) => {
  try {
    const response = await apiClient.post('/users/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData: any) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const response = await apiClient.get(`/users/profile/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (username: string, profileData: any) => {
  try {
    const response = await apiClient.put(`/users/profile/${username}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Pet Services
export const getPetTypes = async () => {
  try {
    console.log('Fetching pet types from:', `${API_URL}/pets/types`);
    const response = await apiClient.get('/pets/types');
    console.log('Pet types response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching pet types:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to the server. Please make sure the backend is running.');
      }
      throw new Error(`Server error: ${error.message}`);
    }
    throw error;
  }
};

export const getBreedsByPetType = async (petTypeId: number) => {
  try {
    const response = await apiClient.get(`/pets/breeds?petTypeId=${petTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    throw error;
  }
};

export const getBreedDetails = async (breedId: number) => {
  try {
    const response = await apiClient.get(`/pets/breeds/${breedId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching breed details:', error);
    throw error;
  }
};

export const getBreedById = async (breedId: number) => {
  try {
    const response = await apiClient.get(`/pets/breeds/${breedId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching breed by ID:', error);
    throw error;
  }
};

export const getAvailablePets = async () => {
  try {
    const response = await apiClient.get('/pets/available');
    return response.data;
  } catch (error) {
    console.error('Error fetching available pets:', error);
    throw error;
  }
};

export const adoptPet = async (adoptionData: any) => {
  try {
    const response = await apiClient.post('/pets/adopt', adoptionData);
    return response.data;
  } catch (error) {
    console.error('Error adopting pet:', error);
    throw error;
  }
};

// Product Services
export const getProductCategories = async () => {
  try {
    const response = await apiClient.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};

export const getProducts = async (filters = {}) => {
  try {
    const response = await apiClient.get('/products/list', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: string | string[], petTypeId: string | string[]) => {
  try {
    console.log('Fetching products with:', { categoryId, petTypeId }); // Debug log
    const response = await apiClient.get('/products/list', {
      params: { 
        category: categoryId,
        pet_type: petTypeId 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const getProductDetails = async (productId: number) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getProductById = async (productId: number) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Cart Services
export const getCart = async (username: string) => {
  try {
    const response = await apiClient.get('/products/cart', { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (cartData: any) => {
  try {
    const response = await apiClient.post('/products/cart/add', cartData);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (cartId: number) => {
  try {
    const response = await apiClient.post('/products/cart/remove', { cart_id: cartId });
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartQuantity = async (cartId: number, quantity: number) => {
  try {
    const response = await apiClient.post('/products/cart/update', { cart_id: cartId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Order Services
export const placeOrder = async (orderData: any) => {
  try {
    const response = await apiClient.post('/orders/place', orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const getOrderHistory = async (username: string) => {
  try {
    const response = await apiClient.get(`/orders/history/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

export const getOrderDetails = async (orderId: number) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Vet Services
export const getVets = async (filters: { city?: string; state?: string; rating?: number } = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.state) queryParams.append('state', filters.state);
    if (filters.rating) queryParams.append('rating', filters.rating.toString());
    
    const url = `/api/vets/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching vets:', error);
    throw error;
  }
};

export const getVetDetails = async (vetId: number) => {
  try {
    const response = await fetch(`/api/vets/${vetId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching vet details:', error);
    throw error;
  }
};

export const getVetCities = async () => {
  try {
    const response = await fetch('/api/vets/cities');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching vet cities:', error);
    throw error;
  }
};

export const getVetStates = async () => {
  try {
    const response = await fetch('/api/vets/states');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching vet states:', error);
    throw error;
  }
};

// Custom SQL Query Services
export const getAllQueries = async () => {
  try {
    console.log('Fetching all queries...');
    const response = await fetch('/api/sql/queries');
    if (!response.ok) {
      console.error('Failed to fetch queries:', response.status, response.statusText);
      throw new Error(`Failed to fetch queries: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Successfully fetched queries:', data);
    return data;
  } catch (error) {
    console.error('Error fetching queries:', error);
    throw error;
  }
};

export const executeQuery = async (queryId: number) => {
  try {
    console.log(`Executing query with ID: ${queryId}`);
    const response = await fetch(`/api/sql/execute/${queryId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Received non-JSON response:', {
        status: response.status,
        contentType,
        text: text.substring(0, 200) // Log first 200 chars of response
      });
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to execute query:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Failed to execute query: ${response.statusText} - ${errorData.message || ''}`);
    }

    const data = await response.json();
    console.log('Query execution result:', data);
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

export const getStores = async () => {
  try {
    const response = await fetch('/api/stores');
    if (!response.ok) {
      throw new Error('Failed to fetch stores');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

interface Store {
  id: number;
  name: string;
  address: string;
  contactnumber: string;
  city: string;
  state: string;
  available: number;
}

export const getAvailableStores = async (breedId: string): Promise<Store[]> => {
  try {
    const response = await fetch(`/api/stores/available-proxy?breedId=${breedId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stores');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available stores:', error);
    throw error;
  }
};

export const getUserOrders = async (username: string) => {
  try {
    const response = await apiClient.get(`/orders/history/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getUserFavorites = async (username: string) => {
  try {
    const response = await apiClient.get(`/users/${username}/favorites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
}; 
