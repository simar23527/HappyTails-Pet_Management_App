import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, pet_type } = req.query;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return res.status(500).json({ error: 'Backend URL not configured' });
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (category) params.append('category', category as string);
    if (pet_type) params.append('pet_type', pet_type as string);
    
    const queryString = params.toString();
    const url = `${backendUrl}/api/products/list${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Fetching products from: ${url}`);
    
    const response = await fetch(url, {
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
    console.log(`Products fetched:`, data);
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Products list proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
