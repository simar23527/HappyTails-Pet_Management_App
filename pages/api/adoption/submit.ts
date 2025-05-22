import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, breedId, storeId } = req.body;

  if (!username || !breedId || !storeId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if store has availability
    const availabilityResult = await client.query(
      'SELECT availability FROM store_breed_availability WHERE store_id = $1 AND breed_id = $2',
      [storeId, breedId]
    );

    if (availabilityResult.rows.length === 0 || availabilityResult.rows[0].availability <= 0) {
      throw new Error('No availability for this breed at the selected store');
    }

    // Create adoption record
    const adoptionResult = await client.query(
      'INSERT INTO adoptions (username, breed_id, store_id, adoption_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id',
      [username, breedId, storeId]
    );

    // Update store availability
    await client.query(
      'UPDATE store_breed_availability SET availability = availability - 1 WHERE store_id = $1 AND breed_id = $2',
      [storeId, breedId]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      adoptionId: adoptionResult.rows[0].id,
      message: 'Adoption request submitted successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting adoption:', error);
    return res.status(500).json({
      error: 'Failed to submit adoption request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });

  } finally {
    client.release();
  }
} 