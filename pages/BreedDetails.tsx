import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, Check, Heart, Info } from "lucide-react";
import { getBreedById } from "../data/apiService";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

const BreedDetails = () => {
  const router = useRouter();
  const { breedId } = router.query;

  const [breedDetails, setBreedDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreedDetails = async () => {
      // Only fetch when breedId is available (after hydration)
      if (!breedId) return;
      
      try {
        setLoading(true);
        const data = await getBreedById(Number(breedId));
        
        if (data) {
          setBreedDetails(data);
          setError(null);
        } else {
          setError('Breed not found');
        }
      } catch (err) {
        console.error('Error fetching breed details:', err);
        setError('Failed to load breed details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBreedDetails();
  }, [breedId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Loading Breed Details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
        <div className="mt-4">
          <Link href="/PetAdoption">
            <a className="text-purple-600 hover:underline">Return to Pet Adoption</a>
          </Link>
        </div>
      </div>
    );
  }

  if (!breedDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Breed Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the breed you're looking for.</p>
        <Link href="/PetAdoption">
          <a className="text-purple-600 hover:underline">Return to Pet Adoption</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/PetBreeds?typeId=${breedDetails.pet_type_id}`}>
          <a className="inline-flex items-center text-purple-600 hover:text-purple-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Breeds
          </a>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 mb-8">
        <div className="md:flex">
          <div className="md:w-1/2">
            {breedDetails.image_url ? (
              <img 
                src={breedDetails.image_url} 
                alt={breedDetails.name} 
                className="w-full h-full object-cover"
                style={{ maxHeight: "500px" }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4">{breedDetails.name}</h1>
            <p className="text-gray-700 mb-6">{breedDetails.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {breedDetails.care_level && (
                <div className="bg-gray-100 px-4 py-2 rounded">
                  <span className="block text-sm text-gray-500">Care Level</span>
                  <span className="font-medium">{breedDetails.care_level}</span>
                </div>
              )}
              
              {breedDetails.lifespan && (
                <div className="bg-gray-100 px-4 py-2 rounded">
                  <span className="block text-sm text-gray-500">Lifespan</span>
                  <span className="font-medium">{breedDetails.lifespan}</span>
                </div>
              )}
              
              {breedDetails.size && (
                <div className="bg-gray-100 px-4 py-2 rounded">
                  <span className="block text-sm text-gray-500">Size</span>
                  <span className="font-medium">{breedDetails.size}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {breedDetails.available_pets && breedDetails.available_pets.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Available {breedDetails.name}s</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breedDetails.available_pets.map((pet) => (
              <Card 
                key={pet.id || pet.pet_id} 
                className="overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  {pet.image_url ? (
                    <img 
                      src={pet.image_url} 
                      alt={pet.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{pet.name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{pet.age}</span>
                      <span className="text-sm text-gray-600">{pet.gender}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">{pet.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Pets Currently Available</h2>
          <p className="text-gray-600 mb-4">
            We don't have any pets of this breed available for adoption at the moment.
          </p>
          <Link href={`/PetBreeds?typeId=${breedDetails.pet_type_id}`}>
            <a className="text-purple-600 hover:text-purple-800 font-medium">
              View Other Breeds
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BreedDetails;
