import React from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isLandingPage = router.pathname === '/';

  return (
    <div className="min-h-screen bg-white">
      {!isLandingPage && <Navbar />}
      <main className={!isLandingPage ? "pt-16" : ""}>{children}</main>
    </div>
  );
};

export default Layout; 