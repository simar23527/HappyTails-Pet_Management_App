import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBreedsByPetType } from "../data/apiService";

const CatBreeds = () => {
  const [catBreeds, setCatBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatBreeds = async () => {
      try {
        setLoading(true);
        // Cat type ID is 2
        const data = await getBreedsByPetType(2);
        setCatBreeds(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching cat breeds:', err);
        setError('Failed to load cat breeds. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatBreeds();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Loading Cat Breeds...</h1>
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
          <Link href="/PetAdoption" className="text-purple-600 hover:underline">
            Back to Pet Types
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/PetAdoption" className="inline-flex items-center text-purple-600 hover:text-purple-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pet Types
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cat Breeds Available for Adoption</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catBreeds.map((breed) => (
          <div 
            key={breed.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
          >
            <div className="h-64 bg-gray-200">
              <img 
                src={breed.image_url || `https://source.unsplash.com/300x200/?cat,${breed.name.replace(' ', '+')}`} 
                alt={breed.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{breed.name}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {breed.characteristics && breed.characteristics.slice(0, 3).map((trait, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded">
                    <span className="text-sm text-gray-500">{trait}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Lifespan</span>
                  <p className="font-medium">{breed.averagelifespan} years</p>
                </div>
                
                <Link href={`/AdoptForm?breedId=${breed.id}`} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                  Adopt
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatBreeds; 