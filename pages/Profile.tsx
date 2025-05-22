import React, { useState, useEffect } from "react";
import { Archive, Edit, Package, User, ShoppingBag, LogOut, PawPrint, Settings, Heart, ChevronLeft, ChevronRight, X, Calendar, MapPin, Truck, RefreshCw } from "lucide-react";
import { useRouter } from 'next/router';
import Link from 'next/link';

interface UserProfile {
  username: string;
  email: string;
  orders?: any[];
  pets?: any[];
}

interface OrderDetail {
  productid: number;
  product_name: string;
  price: number;
  quantity: number;
  total_price: number;
}

interface Order {
  orderid: number;
  orderdate: string;
  status: string;
  store_name: string;
  store_address: string;
  store_city: string;
  store_state: string;
  subtotal: number;
  tax: number;
  total: number;
  items: OrderDetail[];
}

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderError, setOrderError] = useState<string>('');
  const [retryingOrder, setRetryingOrder] = useState(false);
  
  // For demo purposes, we'll use a hardcoded user ID
  // In a real app, this would come from authentication
  const userId = 'user106';
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { username } = JSON.parse(user);
        const response = await fetch(`/api/users/profile/${username}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const fetchOrderDetails = async (orderId: number) => {
    setOrderDetailsLoading(true);
    setOrderError('');
    
    try {
      // Add a small delay when retrying
      if (retryingOrder) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRetryingOrder(false);
      }
      
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the response data
      if (!data || !data.orderid) {
        throw new Error('Invalid order data received');
      }
      
      setSelectedOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrderError('Failed to load order details. The order might not exist or the server is temporarily unavailable.');
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const retryFetchOrder = () => {
    if (!selectedOrder && !orderDetailsLoading) {
      return;
    }
    
    setRetryingOrder(true);
    fetchOrderDetails(selectedOrder?.orderid || 0);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderError('');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Display loading state
  if (loading || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Account</h1>
        <p>Loading profile information...</p>
      </div>
    );
  }
  
  const recentOrders = orders.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/home" className="flex items-center">
                <PawPrint className="h-8 w-8 text-purple-500" />
                <span className="ml-2 text-xl font-bold">Happy Tails</span>
              </Link>
              <div className="ml-10 space-x-8">
                <Link href="/home" className="text-gray-700 hover:text-purple-500">Home</Link>
                <Link href="/adoption" className="text-gray-700 hover:text-purple-500">Adoption</Link>
                <Link href="/PetShopping" className="text-gray-700 hover:text-purple-500">Shopping</Link>
                <Link href="/vet-services" className="text-gray-700 hover:text-purple-500">Vet Services</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">{profile.username}</h2>
                <p className="text-gray-600 mb-6">{profile.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'profile' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'orders' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('pets')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'pets' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  My Pets
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'settings' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <p className="mt-1 text-gray-900">{profile.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Order History</h3>
                  {profile.orders?.length ? (
                    <div className="space-y-6">
                      {profile.orders.map((order: any) => (
                        <div key={order.orderid} className="border rounded-lg overflow-hidden">
                          {/* Order Header */}
                          <div className="bg-gray-50 px-4 py-3 border-b">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-lg">Order #{order.orderid}</p>
                                <p className="text-sm text-gray-600">{formatDate(order.orderdate)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          {/* Order Items */}
                          <div className="p-4">
                            <div className="mb-4">
                              <h4 className="font-medium text-sm text-gray-500 mb-2">Items Ordered</h4>
                              {order.items && order.items.length > 0 ? (
                                <div className="space-y-3">
                                  {order.items.map((item: any) => (
                                    <div key={item.productid} className="flex justify-between">
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                          <Package className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">{item.product_name || 'Product'}</p>
                                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                      </div>
                                      <p className="text-sm font-medium">
                                        {formatCurrency(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">Item details not available</p>
                              )}
                            </div>
                            
                            {/* Order Total */}
                            <div className="border-t pt-3 mt-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-semibold">{formatCurrency(order.total || 0)}</span>
                              </div>
                            </div>
                            
                            {/* Shipping Info */}
                            {order.store_name && (
                              <div className="mt-4 text-sm">
                                <h4 className="font-medium text-gray-500 mb-1">Shipping Address</h4>
                                <p className="text-gray-700">{order.store_name}</p>
                                <p className="text-gray-600">{order.store_address}</p>
                                <p className="text-gray-600">{order.store_city}, {order.store_state}</p>
                              </div>
                            )}
                            
                            {/* Link to full details */}
                            <div className="mt-4 text-right">
                              <Link 
                                href={`/orders/${order.orderid}`}
                                className="text-sm text-purple-600 hover:text-purple-800"
                              >
                                View full details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No orders found.</p>
                  )}
                </div>
              )}

              {activeTab === 'pets' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">My Pets</h3>
                  {profile.pets?.length ? (
                    <div className="grid grid-cols-2 gap-4">
                      {profile.pets.map((pet: any) => (
                        <div key={pet.petid} className="border rounded-lg p-4">
                          <h4 className="font-semibold">{pet.breed}</h4>
                          <p className="text-sm text-gray-600">{pet.pet_type}</p>
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Age: {pet.age} years</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm text-gray-600">Gender: {pet.gender}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No pets found.</p>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                  <div className="space-y-4">
                    <button className="text-purple-600 hover:text-purple-700">
                      Change Password
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;