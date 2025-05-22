import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, name, email, phone, address, city, state, password } = req.body;

    if (!username || !name || !email || !phone || !address || !city || !state || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM Users WHERE Username = $1 OR Email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Create new user
    const result = await pool.query(
      'INSERT INTO Users (Username, Name, Email, Phone, Address, City, State, Password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING Username, Name, Email, Phone, Address, City, State',
      [username, name, email, phone, address, city, state, password]
    );

    return res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 