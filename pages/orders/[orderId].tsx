import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, Calendar, Truck, CheckCircle, RefreshCw } from 'lucide-react';

const OrderDetails = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Add a small delay to prevent rapid retries
      if (retrying) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRetrying(false);
      }
      
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if the data has the expected structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchOrderDetails();
  }, [orderId]);

  const handleRetry = () => {
    setRetrying(true);
    fetchOrderDetails();
  };

  const formatDate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <button 
            onClick={() => router.push('/OrderHistory')}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order History
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-md text-center">
          <p className="mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {retrying ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <button 
            onClick={() => router.push('/OrderHistory')}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order History
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          Order not found. It may have been deleted or you may not have permission to view it.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="mb-6">
        <button 
          onClick={() => router.push('/OrderHistory')}
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Order History
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.orderid}</h1>
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                Placed on {formatDateTime(order.orderdate)}
              </div>
              <div className="text-gray-500 text-sm flex items-center">
                <span className="mr-2">Status:</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{order.store_name}</p>
              <p className="text-gray-600">{order.store_address}</p>
              <p className="text-gray-600">{order.store_city}, {order.store_state}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {order.items && order.items.map((item) => (
              <div key={item.productid} className="py-4 flex items-center border-b last:border-b-0 border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-gray-500" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-medium">{formatCurrency(item.total_price)}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between py-2 font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 