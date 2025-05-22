import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { breedId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!breedId) {
    return res.status(400).json({ error: 'Breed ID is required' });
  }

  const client = await pool.connect();
  try {
    // Query the stores with availability using the correct table names
    const result = await client.query(
      `SELECT s.StoreID as id, s.Name as name, s.Address as address, 
       s.ContactNumber as contact, s.City as city, a.Available as available
       FROM Store s
       INNER JOIN Availability a ON s.StoreID = a.StoreID
       WHERE a.BreedID = $1 AND a.Available > 0
       ORDER BY s.Name`,
      [breedId]
    );

    // If no stores found with availability, return empty array
    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in stores/available:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch available stores',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    client.release();
  }
} 