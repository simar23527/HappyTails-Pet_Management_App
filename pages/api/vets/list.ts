import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return res.status(500).json({ error: 'Backend URL not configured' });
    }

    // Get query parameters for filtering
    const { city, state, rating } = req.query;
    const queryParams = new URLSearchParams();
    if (city) queryParams.append('city', city.toString());
    if (state) queryParams.append('state', state.toString());
    if (rating) queryParams.append('rating', rating.toString());

    const apiUrl = `${backendUrl}/api/vets/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log(`Fetching vets from: ${apiUrl}`);
    
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
    console.log(`Vets fetched:`, data);
    
    // Transform data to match frontend expectations
    const transformedData = data.map((vet: any) => ({
      vetid: vet.id,
      name: vet.name,
      specialization: "General Veterinarian", // Default since not in DB
      clinic_name: `${vet.name}'s Clinic`, // Generate from vet name
      address: `${vet.address}, ${vet.city}, ${vet.state}`,
      phone: vet.contactnumber,
      rating: vet.rating || 0,
      available: true, // Default to true
      city: vet.city,
      state: vet.state,
      openingtime: vet.openingtime,
      closingtime: vet.closingtime
    }));
    
    return res.status(200).json(transformedData);
    
  } catch (error) {
    console.error('Vets proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch vets',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
