import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getPetTypes } from "../data/apiService";
import { Dog, Cat, Fish, Bird, Rabbit } from "lucide-react";

const PetAdoption = () => {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add debug logs
        console.log('Starting to fetch pet types...');
        
        const typesData = await getPetTypes();
        console.log('Received pet types data:', typesData);
        
        setPetTypes(typesData || []);
      } catch (err) {
        console.error('Error in PetAdoption:', err);
        setError(err.message || 'Failed to load pet data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get the right icon component based on the pet type name
  const getIconComponent = (petTypeName: string) => {
    switch (petTypeName?.toLowerCase()) {
      case "dog":
        return <Dog size={48} className="text-purple-600" />;
      case "cat":
        return <Cat size={48} className="text-purple-600" />;
      case "fish":
        return <Fish size={48} className="text-purple-600" />;
      case "bird":
        return <Bird size={48} className="text-purple-600" />;
      default:
        return <Rabbit size={48} className="text-purple-600" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pet types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left max-w-md mx-auto">
            <p className="font-medium mb-2">Troubleshooting steps:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Check if the backend server is running on port 5000</li>
              <li>Verify database connection settings</li>
              <li>Ensure all required tables exist in the database</li>
              <li>Check browser console for detailed error messages</li>
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pet Adoption</h1>
      
      <p className="text-lg mb-8">
        Find your perfect companion! Select the type of pet you're interested in to explore available breeds.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {petTypes.map((petType) => (
          <Link 
            href={`/PetBreeds?type=${petType.id}&name=${petType.name}`}
            key={petType.id}
            className="block"
          >
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <div className="flex justify-center mb-4">
                {getIconComponent(petType.name)}
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">{petType.name}</h2>
              <p className="text-gray-600 text-center">{petType.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 bg-purple-100 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Why Adopt?</h2>
        <p className="mb-4">
          By adopting, you're giving a deserving animal a second chance at a loving home. You're not just adding a pet to your life, you're saving a life.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Save a life and reduce pet homelessness</li>
          <li>Find an already-socialized pet that fits your lifestyle</li>
          <li>Most shelter pets are already trained and ready for home life</li>
          <li>Adoption fees are less than buying from breeders</li>
        </ul>
      </div>
    </div>
  );
};

export default PetAdoption;