import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Phone, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { getVets, getVetCities } from "../data/apiService";

const VetList = () => {
  const router = useRouter();
  const { city } = router.query;
  const [locationName, setLocationName] = useState("");
  const [locationVets, setLocationVets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch data when router is ready and we have the city parameter
    if (!router.isReady || !city) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get location name
        const cities = await getVetCities();
        const foundLocation = cities.find((cityName: any) => 
          cityName.toLowerCase().replace(/\s+/g, '-') === city
        );
        setLocationName(foundLocation || "this location");
        
        // Get vets for this location
        // Pass the city as a filter parameter to getVets
        const vets = await getVets({ city: foundLocation });
          
        // Add some default values and format the data
        const enhancedVets = vets.map((vet: any) => ({
          ...vet,
          image: vet.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          reviews: vet.reviews || Math.floor(Math.random() * 50) + 10,
          phone: vet.contactnumber || "555-123-4567",
          rating: vet.rating || 4,
          // Format hours from opening and closing times in the database
          hours: formatHours(vet.openingtime, vet.closingtime),
          // Add services (these would ideally come from the database)
          services: [
            "General Checkups", 
            "Vaccinations", 
            "Surgery", 
            "Dental Care", 
            "Emergency Services"
          ],
        }));
          
        setLocationVets(enhancedVets);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router.isReady, city]);
  
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
  
  // Get today's day name (lowercase)
  const getTodayDayName = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[new Date().getDay()];
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading veterinarians...</h1>
      </div>
    );
  }
  
  if (!city || !locationVets.length) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No veterinarians found</h1>
        <p className="text-gray-600 mb-6">We couldn't find any veterinarians in this location.</p>
        <Link href="/VetServices">
          <Button>Return to Vet Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/VetServices" 
          className="inline-flex items-center text-happy-purple hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Vet Services
        </Link>
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Veterinarians in {locationName}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We found {locationVets.length} veterinarians serving {locationName}. 
          Select a vet to view more details.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {locationVets.map((vet) => (
          <Card key={vet.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto">
                <img 
                  src={vet.image} 
                  alt={vet.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="flex-1 p-6">
                <h2 className="text-2xl font-semibold mb-2">{vet.name}</h2>
                
                <div className="flex items-center mb-3">
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
                
                <div className="flex items-center mb-2">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <span>{vet.phone}</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <Clock size={16} className="mr-2 text-gray-500" />
                  <span>
                    Today: {vet.hours[getTodayDayName()]}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {vet.services.slice(0, 3).map((service: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-happy-blue/20 text-gray-700 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                  {vet.services.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{vet.services.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href={`/VetDetails?id=${vet.id}&city=${city}`}>View Details</Link>
                  </Button>
                  <Button variant="outline">Call Now</Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VetList;