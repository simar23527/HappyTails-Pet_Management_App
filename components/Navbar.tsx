import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, ShoppingCart, ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import CartModal from './CartModal';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const cartContext = React.useContext(CartContext);
  const [user, setUser] = useState<any>(null);

  // Get user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Close account menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Also clear cookie for middleware
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    setIsAccountMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                    <path d="M15 9C15 10.1046 14.1046 11 13 11C11.8954 11 11 10.1046 11 9C11 7.89543 11.8954 7 13 7C14.1046 7 15 7.89543 15 9Z" fill="currentColor"/>
                    <path d="M9 13C9 14.1046 8.10457 15 7 15C5.89543 15 5 14.1046 5 13C5 11.8954 5.89543 11 7 11C8.10457 11 9 11.8954 9 13Z" fill="currentColor"/>
                    <path d="M19 13C19 14.1046 18.1046 15 17 15C15.8954 15 15 14.1046 15 13C15 11.8954 15.8954 11 17 11C18.1046 11 19 11.8954 19 13Z" fill="currentColor"/>
                    <path d="M11 17C11 18.1046 10.1046 19 9 19C7.89543 19 7 18.1046 7 17C7 15.8954 7.89543 15 9 15C10.1046 15 11 15.8954 11 17Z" fill="currentColor"/>
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-900">Happy Tales</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className={`text-base ${router.pathname === '/dashboard' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/home" 
                className={`text-base ${router.pathname === '/home' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Home
              </Link>
              <Link 
                href="/PetAdoption" 
                className={`text-base ${router.pathname === '/PetAdoption' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Adoption
              </Link>
              <Link 
                href="/PetShopping" 
                className={`text-base ${router.pathname === '/PetShopping' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Shopping
              </Link>
              <Link 
                href="/VetServices" 
                className={`text-base ${router.pathname === '/VetServices' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Vet Services
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ShoppingBag className="h-6 w-6" />
              </button>
              
              {/* Account dropdown menu */}
              <div className="relative" ref={accountMenuRef}>
                <button 
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className={`flex items-center px-4 py-2 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors ${
                    router.pathname === '/Profile' || router.pathname === '/OrderHistory' ? 'bg-purple-600 text-white' : ''
                  }`}
                >
                  <span>{user ? user.username : 'Account'}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user ? (
                      <>
                        <Link 
                          href="/Profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>My Profile</span>
                          </div>
                        </Link>
                        <Link 
                          href="/OrderHistory" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            <span>Order History</span>
                          </div>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>Logout</span>
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          href="/?login=true" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>Login</span>
                          </div>
                        </Link>
                        <Link 
                          href="/?signup=true" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>Sign Up</span>
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Only render CartModal if CartContext is available */}
      {cartContext && <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </>
  );
};

export default Navbar; 
