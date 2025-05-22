import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Stethoscope, PawPrint } from 'lucide-react';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-happy-purple/30 to-happy-purple-dark/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-happy-purple">Happy Tales</span> Universe
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mb-10">
              Your one-stop destination for all pet needs - from adoption to shopping to finding the perfect vet.
            </p>
            <button className="rounded-full bg-happy-purple hover:bg-happy-purple-dark text-white py-3 px-8 text-lg font-medium">
              <Link href="/PetAdoption">
                Explore Now
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pet Adoption Card */}
            <div 
              onClick={() => router.push('/PetAdoption')}
              className="bg-[#F3FFE9] rounded-2xl p-8 text-center cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <PawPrint size={48} className="text-happy-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pet Adoption</h3>
              <p className="text-gray-700">
                Find your perfect furry, feathery, or scaly companion from our wide selection of pets.
              </p>
            </div>
            
            {/* Pet Shopping Card */}
            <div 
              onClick={() => router.push('/PetShopping')}
              className="bg-[#FFE9E1] rounded-2xl p-8 text-center cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={48} className="text-happy-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pet Shopping</h3>
              <p className="text-gray-700">
                Shop for pet food, toys, clothes, and accessories for all your pet needs.
              </p>
            </div>
            
            {/* Vet Services Card */}
            <div 
              onClick={() => router.push('/VetServices')}
              className="bg-[#E1F9FF] rounded-2xl p-8 text-center cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Stethoscope size={48} className="text-happy-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vet Services</h3>
              <p className="text-gray-700">
                Find trusted veterinarians near you for check-ups, treatments, and emergencies.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Happy Tales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">All-in-One Platform</h3>
              <p className="text-gray-600">Everything you need for your pet, all in one place.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">Verified Partners</h3>
              <p className="text-gray-600">We work only with trusted pet shops and veterinarians.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">Community Support</h3>
              <p className="text-gray-600">Join our community of pet lovers for tips and advice.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">24/7 Assistance</h3>
              <p className="text-gray-600">Our customer service team is always ready to help.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 