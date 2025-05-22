import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Plus, Eye, Minus } from "lucide-react";
import { useCart } from '../context/CartContext';

const ProductListing = () => {
  const router = useRouter();
  const { categoryId, petTypeId } = router.query;
  const { items, addItem, total } = useCart();
  const [showCartPreview, setShowCartPreview] = useState(true);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!categoryId || !petTypeId) {
          setError('Invalid category or pet type');
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await fetch(`/api/products/list?category=${categoryId}&pet_type=${petTypeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchProducts();
    }
  }, [categoryId, petTypeId, router.isReady]);

  const handleAddToCart = async (product) => {
    try {
      await addItem(product);
      setShowCartPreview(true);
    } catch (error) {
      console.error('Failed to add item to cart');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Loading Products...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <Link 
          href="/PetShopping"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/PetShopping"
            className="text-purple-600 hover:text-purple-700 flex items-center mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-2xl font-bold">
            {products[0]?.category_name || 'Products'} for {products[0]?.pet_type_name || 'Pets'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.product_id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-4">
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-2xl font-bold text-purple-600 mb-2">
                  {formatPrice(product.price)}
                </p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  product.in_stock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="p-4 border-t">
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.in_stock}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
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

export default ProductListing;