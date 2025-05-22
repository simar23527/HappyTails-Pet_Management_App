import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Package, Calendar, MapPin, DollarSign, ShoppingBag } from 'lucide-react';

const OrderHistory = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // Check if user is logged in
        const userJson = localStorage.getItem('user');
        
        // For testing purposes with user1 from the database
        let username = 'user1';
        
        if (userJson) {
          const user = JSON.parse(userJson);
          username = user.username;
        } else {
          // For testing only - provide a mock user if none exists
          console.log('Using test user (user1) for demonstration');
          // In a real app, you would redirect to login
          // router.push('/');
          // return;
        }

        const response = await fetch(`/api/orders/history/${username}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order history');
        }
        
        const data = await response.json();
        
        // Fetch preview items for each order
        const ordersWithPreviews = await Promise.all(
          data.map(async (order) => {
            try {
              const detailsResponse = await fetch(`/api/orders/${order.orderid}`);
              if (detailsResponse.ok) {
                const details = await detailsResponse.json();
                // Add items to the order object
                if (details.items && details.items.length > 0) {
                  order.items = details.items;
                  order.store_name = details.store_name;
                  order.store_address = details.store_address;
                  order.store_city = details.store_city;
                  order.store_state = details.store_state;
                  order.subtotal = details.subtotal;
                  order.tax = details.tax;
                }
              }
            } catch (error) {
              console.error(`Error fetching details for order ${order.orderid}:`, error);
            }
            return order;
          })
        );
        
        setOrders(ordersWithPreviews);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [router]);

  const formatDate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <button 
            onClick={() => router.push('/PetShopping')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.orderid} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                <div>
                  <p className="text-sm text-gray-500">Order Placed</p>
                  <p className="font-medium">{formatDate(order.orderdate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order #</p>
                  <p className="font-medium">{order.orderid}</p>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              {/* Order content section */}
              <div className="p-4">
                {/* Store information */}
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium mb-1">
                      {order.items?.length || order.item_count} items from {order.store_name}
                    </p>
                    {order.store_address && (
                      <p className="text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 inline mr-1 text-gray-400" />
                        {order.store_address}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      <MapPin className="h-4 w-4 inline mr-1 text-gray-400" />
                      {order.store_city}, {order.store_state}
                    </p>
                  </div>
                </div>
                
                {/* Order items */}
                {order.items && order.items.length > 0 ? (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Items Ordered</p>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.productid} className="flex justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                              <Package className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.product_name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm italic text-gray-500">Item details not available</p>
                  </div>
                )}
                
                {/* Order summary */}
                {(order.subtotal || order.tax) && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Tax:</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between py-1 font-medium">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 