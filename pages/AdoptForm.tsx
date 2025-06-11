import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Calendar, MapPin, Phone, Check, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { getAvailableStores } from '../data/apiService';

interface Store {
  id: number;
  name: string;
  address: string;
  contactnumber: string;
  city: string;
  state: string;
  available: number;
}

interface FormData {
  username: string;
  email: string;
  phone: string;
  address: string;
  store: string;
}

const AdoptForm = () => {
  const router = useRouter();
  const { breedId, breedName, petType, lifespan } = router.query;
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    address: '',
    store: ''
  });
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      if (!breedId || Array.isArray(breedId)) return;
      
      try {
        setLoading(true);
        console.log('Fetching stores for breedId:', breedId);
        const storesData = await getAvailableStores(breedId);
        console.log('Received stores data:', storesData);
        if (storesData.length === 0) {
          setError('Sorry, this breed is currently not available at any store.');
        } else {
          setStores(storesData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load store locations. ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [breedId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'store') {
      const store = stores.find(s => s.id.toString() === value);
      setSelectedStore(store || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save adoption request
      console.log('Submitting adoption request:', {
        breedId,
        ...formData
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      alert('Failed to submit adoption request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4">Loading store locations...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted && selectedStore) {
    // Generate a random date between 3 to 7 days from now
    const today = new Date();
    const pickupDate = new Date(today.getTime() + Math.random() * (7 - 3) * 24 * 60 * 60 * 1000 + 3 * 24 * 60 * 60 * 1000);
    const formattedDate = pickupDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <div className="bg-purple-600 p-6 rounded-t-lg">
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-full p-3">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mt-4">
              Adoption Request Submitted!
            </h1>
            <p className="text-purple-100 text-center mt-2">
              Thank you for choosing to adopt a pet. We're excited to help you welcome your new family member!
            </p>
          </div>

          <div className="p-6">
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold mb-4">Adoption Details</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Pickup Date</p>
                    <p className="text-gray-600">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Store Location</p>
                    <p className="text-gray-600">{selectedStore.name}</p>
                    <p className="text-gray-600">{selectedStore.address}</p>
                    <p className="text-gray-600">{selectedStore.city}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Store Contact</p>
                    <p className="text-gray-600">{selectedStore.contactnumber}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Home className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Your Pet</p>
                    <p className="text-gray-600">{breedName} ({petType})</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/PetAdoption')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Back to Pet Types
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Print Confirmation
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Breeds
        </button>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Adopt a {typeof breedName === 'string' ? breedName : ''}
          </h1>
          <p className="text-gray-600">Please fill out the form below to submit your adoption request.</p>
        </div>

        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h2 className="font-semibold mb-2">Pet Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Breed</p>
              <p className="font-medium">{typeof breedName === 'string' ? breedName : ''}</p>
            </div>
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-medium">{typeof petType === 'string' ? petType : ''}</p>
            </div>
            <div>
              <p className="text-gray-600">Average Lifespan</p>
              <p className="font-medium">{typeof lifespan === 'string' ? lifespan : ''} years</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-600">
            {error}
            <Button 
              onClick={() => router.push('/PetAdoption')}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Browse Other Pets
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                Full Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                Home Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="store">
                Preferred Store Location
              </label>
              <select
                id="store"
                name="store"
                value={formData.store}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select a store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.city} ({store.available} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Submit Adoption Request
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdoptForm; 
