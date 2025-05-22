import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { getUserFavorites } from "@/data/apiService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addItem } = useCart();
  
  // For demo purposes, we'll use a hardcoded user ID
  // In a real app, this would come from authentication
  const userId = 'user106';
  
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const favoritesData = await getUserFavorites(userId);
        setFavorites(favoritesData || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [userId]);
  
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image_url || "https://placehold.co/600x400?text=No+Image"
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleRemoveFavorite = (productId: string, productName: string) => {
    toast({
      title: "Removed from favorites",
      description: `${productName} has been removed from your favorites.`,
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Favorites</h1>
        <p>Loading favorite products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/profile" 
          className="inline-flex items-center text-happy-purple hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Profile
        </Link>
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">
          Products you've saved for later
        </p>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-gray-400">
            <Heart size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
          <p className="text-gray-600 mb-6">
            Start browsing and save items to your favorites list.
          </p>
          <Button asChild>
            <Link to="/shopping">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="product-card flex flex-col">
              <div className="relative">
                <Link to={`/shopping/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                </Link>
                
                <button 
                  onClick={() => handleRemoveFavorite(product.id, product.name)}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
              
              <CardContent className="p-4 flex-grow">
                <Link to={`/shopping/product/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-happy-purple transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="text-lg font-bold mt-auto">${product.price.toFixed(2)}</div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-happy-purple hover:bg-happy-purple-dark flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;