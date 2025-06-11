import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the Flask backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://happy-tails-api.onrender.com';
    
    console.log(`Attempting to connect to: ${backendUrl}/api/users/register`);
    
    // Forward the request to Flask backend
    const response = await fetch(`${backendUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log(`Backend response status: ${response.status}`);
    const data = await response.json();
    console.log(`Backend response data:`, data);

    // Return the response from Flask backend
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Register proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to connect to backend',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
