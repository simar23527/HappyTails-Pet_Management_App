import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getProductById } from "@/data/apiService";

const ProductDetails = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [quantity, setQuantity] = React.useState(1);
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  
  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (productId) {
          const productData = await getProductById(productId);
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading product information...</h1>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/ProductListing">
          <Button>Return to Pet Shopping</Button>
        </Link>
      </div>
    );
  }
  
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.product_id,
        name: product.name,
        price: product.price,
        image: product.image_url || "https://placehold.co/600x400?text=No+Image"
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} have been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/ProductListing"
          className="text-purple-600 hover:text-purple-700 flex items-center mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
          <ShoppingCart className="w-32 h-32 text-gray-300" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">Product Name</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-gray-600">(4.5/5)</span>
          </div>

          <p className="text-3xl font-bold text-purple-600 mb-6">₹999</p>

          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Minus className="w-6 h-6" />
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 flex items-center justify-center" onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            
            <button className="w-full border border-purple-600 text-purple-600 py-3 px-6 rounded-lg hover:bg-purple-50 flex items-center justify-center">
              <Heart className="w-5 h-5 mr-2" />
              Add to Wishlist
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center text-gray-600">
              <Truck className="w-5 h-5 mr-2" />
              <span>Free delivery on orders above ₹499</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <Card className="p-6">
          <div className="flex items-start mb-4">
            <div className="bg-gray-100 rounded-full p-3 mr-4">
              <span className="font-bold">JD</span>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <h4 className="font-semibold mr-2">John Doe</h4>
                <span className="text-gray-500 text-sm">3 days ago</span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-gray-700">
                Great product! Exactly as described and my pet loves it. Arrived quickly and in perfect condition.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-gray-100 rounded-full p-3 mr-4">
              <span className="font-bold">JS</span>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <h4 className="font-semibold mr-2">Jane Smith</h4>
                <span className="text-gray-500 text-sm">1 week ago</span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < 3 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-gray-700">
                Good quality but smaller than I expected. Still, my pet seems to enjoy it.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;