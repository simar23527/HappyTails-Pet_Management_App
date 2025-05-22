import { Stethoscope, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-2xl font-bold text-purple-600">
                <img src="/logo.svg" alt="Happy Tails" className="h-8 w-8 mr-2" />
                Happy Tails
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/adoption" className="text-gray-600 hover:text-gray-900">Adoption</Link>
              <Link href="/shopping" className="text-gray-600 hover:text-gray-900">Shopping</Link>
              <Link href="/vet-services" className="text-gray-600 hover:text-gray-900">Vet Services</Link>
              <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                <ShoppingBag className="h-6 w-6" />
              </Link>
              <Link href="/account" className="text-gray-600 hover:text-gray-900">Account</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pet Adoption Card */}
          <div className="bg-[#F2FFED] p-8 rounded-2xl transition-transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-4">
                <svg className="w-12 h-12 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                  <path d="M15 9C15 10.1046 14.1046 11 13 11C11.8954 11 11 10.1046 11 9C11 7.89543 11.8954 7 13 7C14.1046 7 15 7.89543 15 9Z" fill="currentColor"/>
                  <path d="M9 13C9 14.1046 8.10457 15 7 15C5.89543 15 5 14.1046 5 13C5 11.8954 5.89543 11 7 11C8.10457 11 9 11.8954 9 13Z" fill="currentColor"/>
                  <path d="M19 13C19 14.1046 18.1046 15 17 15C15.8954 15 15 14.1046 15 13C15 11.8954 15.8954 11 17 11C18.1046 11 19 11.8954 19 13Z" fill="currentColor"/>
                  <path d="M11 17C11 18.1046 10.1046 19 9 19C7.89543 19 7 18.1046 7 17C7 15.8954 7.89543 15 9 15C10.1046 15 11 15.8954 11 17Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Pet Adoption</h2>
            <p className="text-gray-600 text-center">
              Find your perfect furry, feathery, or scaly companion from our wide selection of pets.
            </p>
            <div className="mt-6 text-center">
              <Link href="/adoption" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Browse Pets
              </Link>
            </div>
          </div>

          {/* Pet Shopping Card */}
          <div className="bg-[#FFE8DE] p-8 rounded-2xl transition-transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-4">
                <ShoppingBag className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Pet Shopping</h2>
            <p className="text-gray-600 text-center">
              Shop for pet food, toys, clothes, and accessories for all your pet needs.
            </p>
            <div className="mt-6 text-center">
              <Link href="/shopping" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Vet Services Card */}
          <div className="bg-[#D6F6FF] p-8 rounded-2xl transition-transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-4">
                <Stethoscope className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Vet Services</h2>
            <p className="text-gray-600 text-center">
              Find trusted veterinarians near you for check-ups, treatments, and emergencies.
            </p>
            <div className="mt-6 text-center">
              <Link href="/vet-services" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Find Vets
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services; 