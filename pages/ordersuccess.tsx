import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
  const { items, removeItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Clear all items from cart by calling removeItem for each item
    [...items].forEach(item => {
      removeItem(item.cartId);
    });
    
    // Alternative: Clear localStorage directly
    localStorage.removeItem('cart');
  }, [items, removeItem]);

  const handleReturnHome = () => {
    window.location.href = '/home';  // Using window.location for a hard redirect
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <button 
          onClick={handleReturnHome}
          type="button"
          className="inline-flex items-center justify-center w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5 mr-2" />
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
