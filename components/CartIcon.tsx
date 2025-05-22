import React from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartIcon = () => {
  const router = useRouter();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => router.push('/Cart')}
      className="relative p-2 text-purple-600 hover:text-purple-700"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}; 