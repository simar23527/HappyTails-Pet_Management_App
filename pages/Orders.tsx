import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Package, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { getUserOrders } from "../data/apiService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For demo purposes, we'll use a hardcoded user ID
  // In a real app, this would come from authentication
  const userId = 'user106';
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await getUserOrders(userId);
        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
        <p>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/profile" 
          className="inline-flex items-center text-purple-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Profile
        </Link>
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          View and track your order history
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Search Order</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Order number or product name"
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Date Range</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-gray-400">
            <Package size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link href="/shopping">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold text-lg">Order #{order.id}</span>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">Placed on {order.date}</div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center">
                    <Button variant="outline" size="sm">Track Order</Button>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <ChevronDown size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 w-16 h-16 rounded mr-4"></div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                        <Button variant="link" size="sm" className="text-purple-600 p-0 h-auto">
                          Buy Again
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between">
                  <span className="font-semibold">Order Total</span>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
