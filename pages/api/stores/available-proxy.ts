import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return res.status(500).json({ error: 'Backend URL not configured' });
    }

    const { breedId } = req.query;
    if (!breedId) {
      return res.status(400).json({ error: 'Breed ID is required' });
    }

    const apiUrl = `${backendUrl}/api/pets/stores?breedId=${breedId}`;
    console.log(`Fetching available stores from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    console.log(`Backend response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Available stores fetched:`, data);
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Available stores proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch available stores',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
