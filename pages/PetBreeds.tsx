import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getBreedsByPetType } from "../data/apiService";

interface Breed {
  id: number;
  name: string;
  averagelifespan: number;
  pet_type_id: number;
  pet_type_name: string;
  imageurl: string;
}

const PetBreeds = () => {
  const router = useRouter();
  const { type, name } = router.query;

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (!type) return;
      
      try {
        setLoading(true);
        const data = await getBreedsByPetType(Number(type));
        console.log('Fetched breeds:', data);
        setBreeds(data);
      } catch (err) {
        console.error('Error fetching breeds:', err);
        setError('Failed to load breeds. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, [type]);

  const handleAdopt = (breed: Breed) => {
    router.push({
      pathname: '/AdoptForm',
      query: { 
        breedId: breed.id,
        breedName: breed.name,
        petType: breed.pet_type_name,
        lifespan: breed.averagelifespan
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4">Loading breeds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => router.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => router.push('/PetAdoption')}
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Pet Types
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        {name} Breeds Available for Adoption
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breeds.map((breed) => (
          <div key={breed.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-200">
              {breed.imageurl ? (
                <img 
                  src={breed.imageurl} 
                  alt={breed.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{breed.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Loyal</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Playful</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Energetic</span>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Lifespan:</span> {breed.averagelifespan} years
                </p>
              </div>
              <button 
                onClick={() => handleAdopt(breed)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Adopt
              </button>
            </div>
          </div>
        ))}
      </div>

      {breeds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No breeds available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default PetBreeds;