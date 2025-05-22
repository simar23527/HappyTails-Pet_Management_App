import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

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
  try {
    const client = await pool.connect();
    try {
      // Check if Orders table exists
      const ordersTable = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'orders'
        );
      `);

      // Check if OrderDetails table exists
      const orderDetailsTable = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'orderdetails'
        );
      `);

      return res.status(200).json({
        ordersTableExists: ordersTable.rows[0].exists,
        orderDetailsTableExists: orderDetailsTable.rows[0].exists
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error checking tables:', error);
    return res.status(500).json({ 
      message: 'Failed to check tables',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 