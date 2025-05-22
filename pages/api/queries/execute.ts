import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
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

  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ message: 'SQL query is required' });
  }

  try {
    console.log('Executing manual SQL query:', sql);
    // Execute the query
    const result = await pool.query(sql);
    
    return res.status(200).json({
      rowCount: result.rowCount,
      fields: result.fields.map(field => ({
        name: field.name,
        dataTypeID: field.dataTypeID
      })),
      rows: result.rows
    });
  } catch (error: any) {
    console.error('Error executing query:', error);
    return res.status(500).json({ 
      message: 'Failed to execute query',
      error: error.message 
    });
  }
} 