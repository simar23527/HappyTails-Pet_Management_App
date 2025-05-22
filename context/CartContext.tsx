import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToCart, removeFromCart, getCart } from '../data/apiService';

interface CartItem {
  cartId: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any) => Promise<void>;
  removeItem: (cartId: number) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  total: number;
  showCartPreview: boolean;
  setShowCartPreview: (show: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showCartPreview, setShowCartPreview] = useState(true);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addItem = async (product: any) => {
    const existingItem = items.find(item => item.product_id === product.product_id);
    
    if (existingItem) {
      // Update quantity if item exists
      setItems(items.map(item =>
        item.product_id === product.product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item
      const newItem: CartItem = {
        cartId: Date.now(), // Temporary ID for local storage
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        quantity: 1
      };
      setItems([...items, newItem]);
    }
    setShowCartPreview(true); // Show cart preview when adding items
  };

  const removeItem = (cartId: number) => {
    setItems(items.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(items.map(item =>
      item.cartId === cartId
        ? { ...item, quantity }
        : item
    ));
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      total,
      showCartPreview,
      setShowCartPreview
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 