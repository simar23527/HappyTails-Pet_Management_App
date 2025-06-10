import Link from 'next/link';
import { User } from 'lucide-react';

export default function Navigation() {
  return (
    <Link 
      href="/profile" 
      className="flex items-center text-gray-700 hover:text-purple-500"
    >
      <User className="h-6 w-6" />
    </Link>
  );
}  
