import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { petTypeId } = req.query;
    
    if (!petTypeId) {
      return res.status(400).json({ error: 'Pet type ID is required' });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return res.status(500).json({ error: 'Backend URL not configured' });
    }

    console.log(`Fetching breeds for pet type ${petTypeId} from: ${backendUrl}/api/pets/types/${petTypeId}/breeds`);
    
    const response = await fetch(`${backendUrl}/api/pets/types/${petTypeId}/breeds`, {
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
    console.log(`Breeds for pet type ${petTypeId} fetched:`, data);
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Breeds proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch breeds',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
