import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PawPrint, MapPin, Phone, Clock, Star } from 'lucide-react';

interface Vet {
  vetid: number;
  name: string;
  specialization: string;
  clinic_name: string;
  address: string;
  phone: string;
  rating: number;
  available: boolean;
}

const VetServicesPage = () => {
  const router = useRouter();
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      const response = await fetch('/api/vets/list');
      if (response.ok) {
        const data = await response.json();
        setVets(data);
      }
    } catch (error) {
      console.error('Error fetching vets:', error);
    } finally {
      setLoading(false);
    }
  };

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
                <Link href="/adoption" className="text-gray-700 hover:text-purple-500">Adoption</Link>
                <Link href="/PetShopping" className="text-gray-700 hover:text-purple-500">Shopping</Link>
                <Link href="/vet-services" className="text-purple-500">Vet Services</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find a Veterinarian</h1>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <input
            type="text"
            placeholder="Search by name, specialization, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Vets List */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-6">
            {vets
              .filter(vet => 
                vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vet.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vet.clinic_name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((vet) => (
                <div key={vet.vetid} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Dr. {vet.name}</h3>
                        <p className="text-purple-600 mb-2">{vet.specialization}</p>
                        <p className="text-gray-600 mb-4">{vet.clinic_name}</p>
                        
                        <div className="flex items-center space-x-4 text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {vet.address}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {vet.phone}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < vet.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          vet.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vet.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button 
                        onClick={() => router.push(`/vet-services/book/${vet.vetid}`)}
                        className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                        disabled={!vet.available}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VetServicesPage; 
