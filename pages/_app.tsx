import React from 'react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/globals.css';
import '../index.css';
import { CartProvider } from '../context/CartContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}

export default MyApp; 