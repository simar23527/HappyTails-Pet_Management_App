import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await pool.connect();
    try {
      // Create orders table
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          orderid SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          shipping_address TEXT,
          shipping_city VARCHAR(100),
          shipping_state VARCHAR(50),
          shipping_zip VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create order_items table
      await client.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          orderid INTEGER REFERENCES orders(orderid),
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      return res.status(200).json({ 
        message: 'Tables created successfully' 
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    return res.status(500).json({ 
      message: 'Failed to create tables',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 