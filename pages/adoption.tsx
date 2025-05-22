import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PawPrint, Search, Filter } from 'lucide-react';
import { getAvailablePets, getPetTypes } from '../data/apiService';

interface Pet {
  breedid: number;
  breedname: string;
  pettypename: string;
  total_available: number;
}

interface PetType {
  id: number;
  name: string;
}

const AdoptionPage = () => {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    petType: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsData, typesData] = await Promise.all([
        getAvailablePets(),
        getPetTypes()
      ]);
      console.log('Pets data:', petsData); // Debug log
      console.log('Types data:', typesData); // Debug log
      setPets(petsData);
      setPetTypes(typesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(pet => 
    !filters.petType || pet.pettypename.toLowerCase() === filters.petType.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/home" className="flex items-center">
                <PawPrint className="h-8 w-8 text-purple-500" />
                <span className="ml-2 text-xl font-bold">Happy Tails</span>
              </Link>
              <div className="ml-10 space-x-8">
                <Link href="/home" className="text-gray-700 hover:text-purple-500">Home</Link>
                <Link href="/adoption" className="text-purple-500">Adoption</Link>
                <Link href="/PetShopping" className="text-gray-700 hover:text-purple-500">Shopping</Link>
                <Link href="/vet-services" className="text-gray-700 hover:text-purple-500">Vet Services</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Your Perfect Companion</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.petType}
              onChange={(e) => setFilters({ ...filters, petType: e.target.value })}
              className="border rounded-lg p-2"
            >
              <option value="">All Pet Types</option>
              {petTypes.map(type => (
                <option key={type.id} value={type.name}>
                  {type.name}s
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pet Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading available pets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet.breedid} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pet.breedname}</h3>
                  <div className="text-gray-600 mb-4">
                    <p>{pet.pettypename} • {pet.total_available} available</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/breeds/${pet.breedid}`)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
            {filteredPets.length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600">No pets available matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionPage; 