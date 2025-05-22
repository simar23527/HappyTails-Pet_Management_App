import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Shirt, Utensils, Gamepad2, ShoppingCart, Eye, Minus } from "lucide-react";
import { getProductCategories, getPetTypes } from "../data/apiService";
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';

const PetShopping = () => {
  const router = useRouter();
  const { items, total } = useCart();
  const [showCartPreview, setShowCartPreview] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const petTypes = [
    { id: 1, name: 'Dog' },
    { id: 2, name: 'Cat' },
    { id: 3, name: 'Fish' },
    { id: 4, name: 'Bird' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative min-h-screen pb-32">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Select Pet Type:</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {petTypes.map((petType) => (
                    <Link
                      key={petType.id}
                      href={`/ProductListing?categoryId=${category.id}&petTypeId=${petType.id}`}
                      className="block text-center py-2 px-4 rounded-lg border hover:bg-purple-50 transition-colors"
                    >
                      {petType.name}
                    </Link>
                  ))}
                </div>
                <div className="bg-yellow-100 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-4">
                      <ShoppingCart className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-semibold">{category.name}</span>
                  </div>
                  <div className="text-purple-600">→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Preview */}
      {items.length > 0 && showCartPreview && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold">{items.length} {items.length === 1 ? 'item' : 'items'} in cart</p>
                  <p className="text-lg font-bold text-purple-600">{formatPrice(total)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCartPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <Link 
                  href="/Cart"
                  className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetShopping;