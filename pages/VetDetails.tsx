import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { getVetDetails } from "../data/apiService";

const VetDetails = () => {
  const router = useRouter();
  const { id, city } = router.query;
  const [vet, setVet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch data when router is ready and we have the id parameter
    if (!router.isReady || !id) return;
    
    const fetchVetData = async () => {
      setLoading(true);
      try {
        const vetData = await getVetDetails(Number(id));
        if (vetData) {
          // Enhance the vet data with some default values if needed
          setVet({
            ...vetData,
            reviews: vetData.reviews || 42,
            phone: vetData.contactnumber || "555-123-4567",
            image: vetData.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
            // Format the hours based on opening and closing times
            hours: formatHours(vetData.openingtime, vetData.closingtime),
            // Services would ideally come from a database service-vet relationship
            services: vetData.services || [
              "General Checkups", 
              "Vaccinations", 
              "Surgery", 
              "Dental Care", 
              "Emergency Services", 
              "Laboratory Services"
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching vet details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVetData();
  }, [router.isReady, id]);
  
  // Helper function to format hours based on opening and closing times
  const formatHours = (openingTime: string, closingTime: string) => {
    // Default hours in case the data is missing
    const defaultHours = {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    };
    
    if (!openingTime || !closingTime) return defaultHours;
    
    // Format the hours for display
    const formattedHours = `${openingTime} - ${closingTime}`;
    
    return {
      monday: formattedHours,
      tuesday: formattedHours,
      wednesday: formattedHours,
      thursday: formattedHours,
      friday: formattedHours,
      saturday: formattedHours,
      sunday: "Closed"
    };
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading vet information...</h1>
      </div>
    );
  }
  
  if (!vet) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Veterinarian not found</h1>
        <Link href="/VetServices">
          <Button>Return to Vet Services</Button>
        </Link>
      </div>
    );
  }
  
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={city ? `/VetList?city=${city}` : "/VetServices"}
          className="inline-flex items-center text-happy-purple hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          {city ? "Back to Vet List" : "Back to Vet Services"}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="relative h-64 overflow-hidden">
              <img 
                src={vet.image} 
                alt={vet.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vet.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(vet.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {vet.rating} ({vet.reviews} reviews)
                </span>
              </div>
              
              <div className="flex items-start mb-2">
                <MapPin size={16} className="mr-2 mt-1 text-gray-500" />
                <span>{vet.address}</span>
              </div>
              
              <div className="flex items-center mb-4">
                <Phone size={16} className="mr-2 text-gray-500" />
                <span>{vet.phone}</span>
              </div>
              
              <Separator className="my-6" />
              
              <Tabs defaultValue="services">
                <TabsList className="mb-6">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="hours">Hours</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="services">
                  <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vet.services.map((service: string, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center">
                        <div className="w-8 h-8 rounded-full bg-happy-blue/30 flex items-center justify-center mr-3">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-happy-purple">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="hours">
                  <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
                  <div className="space-y-2">
                    {days.map((day, index) => (
                      <div 
                        key={day} 
                        className={`flex justify-between p-3 rounded ${index === today ? 'bg-happy-blue/20 font-semibold' : ''}`}
                      >
                        <span className="capitalize">{day}</span>
                        <span>{vet.hours[day as keyof typeof vet.hours]}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                  <div className="space-y-4">
                    <Card className="bg-gray-50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                            <span className="font-bold">MR</span>
                          </div>
                          <div>
                            <div className="font-semibold">Mark Reynolds</div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  className={i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Dr. Johnson at {vet.name} is amazing with animals! My dog hates going to the vet but was surprisingly calm during our visit. Highly recommend!
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                            <span className="font-bold">SL</span>
                          </div>
                          <div>
                            <div className="font-semibold">Sarah Lewis</div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Great service and care for my cat. The staff was very gentle and took time to explain everything. A bit pricey, but worth it for the quality of care.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
                <p className="text-gray-600 mb-4">
                  Select a date and time to schedule your pet's appointment.
                </p>
                <Button className="w-full flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  Schedule Now
                </Button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Or call directly: {vet.phone}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Today's Hours</h2>
                <div className="flex items-center text-lg">
                  <Clock size={18} className="mr-2 text-happy-purple" />
                  <span className="font-medium">
                    {vet.hours[days[today] as keyof typeof vet.hours]}
                  </span>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Opening Time: {vet.openingtime}</p>
                  <p>Closing Time: {vet.closingtime}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-600">
                  {vet.name} provides comprehensive veterinary care for pets of all types. 
                  Our team of experienced veterinarians is dedicated to keeping your pets healthy and happy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetDetails;
