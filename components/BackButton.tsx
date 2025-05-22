import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

export const BackButton = () => {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
    >
      <ArrowLeft size={20} className="mr-1" />
      Back to Categories
    </button>
  );
}; 