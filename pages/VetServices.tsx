import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { MapPin, Search, Stethoscope } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { getVets, getVetStates } from "../data/apiService";

const VetServices = () => {
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVets, setLoadingVets] = useState(false);
  const router = useRouter();
  
  // Indian states list (fallback in case API call fails)
  const indiaStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi"
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to get states from the API
        const statesData = await getVetStates();
        
        // If we got data back from API, use it
        if (statesData && statesData.length > 0) {
          setStates(statesData);
        } else {
          // Otherwise use our fallback list
          setStates(indiaStates);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        // Use fallback list if API call fails
        setStates(indiaStates);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load vets when state is selected
  useEffect(() => {
    if (!selectedState) return;
    
    const fetchVets = async () => {
      setLoadingVets(true);
      try {
        console.log(`Fetching vets for state: ${selectedState}`);
        const vetsData = await getVets({ state: selectedState });
        console.log('Vets data received:', vetsData);
        setVets(vetsData);
      } catch (error) {
        console.error("Error fetching vets:", error);
        setVets([]);
      } finally {
        setLoadingVets(false);
      }
    };
    
    fetchVets();
  }, [selectedState]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Veterinary Services</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Locate trusted veterinarians in your state for all your pet healthcare needs.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto mb-12 bg-happy-blue/20 rounded-xl p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <Stethoscope size={28} className="text-happy-purple" />
            <h2 className="text-2xl font-semibold">Search for Veterinarians</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-happy-purple focus:border-transparent"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vet List */}
      {loadingVets ? (
        <div className="text-center py-6">
          <p className="text-lg">Loading veterinarians...</p>
        </div>
      ) : selectedState && vets.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center">Veterinarians in {selectedState}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vets.map((vet) => (
              <Card key={vet.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{vet.name}</h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i}
                          className={`text-lg ${i < Math.floor(vet.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({vet.rating || 4})
                    </span>
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <MapPin size={16} className="mr-2 mt-1 text-gray-500" />
                    <span className="text-gray-700">{vet.address}</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-gray-700">
                      <strong>Hours:</strong> {vet.openingtime || "9:00 AM"} - {vet.closingtime || "6:00 PM"}
                    </span>
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <span className="text-gray-700">
                      <strong>Contact:</strong> {vet.contactnumber}
                    </span>
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <span className="text-gray-700">
                      <strong>City:</strong> {vet.city}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : selectedState ? (
        <div className="text-center py-6">
          <p className="text-lg">No veterinarians found in {selectedState}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="rounded-full bg-happy-blue/20 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Stethoscope size={32} className="text-happy-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wellness Check-ups</h3>
              <p className="text-gray-600">
                Regular check-ups help ensure your pet stays healthy and catches any potential issues early.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="rounded-full bg-happy-blue/20 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-happy-purple">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Care</h3>
              <p className="text-gray-600">
                Find vets offering emergency services for when your pet needs immediate attention.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="rounded-full bg-happy-blue/20 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-happy-purple">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vaccinations</h3>
              <p className="text-gray-600">
                Keep your pet protected with up-to-date vaccinations from qualified veterinarians.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VetServices;