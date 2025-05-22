import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Build the API URL with the correct prefix
    const apiUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/orders/${orderId}`;
    console.log(`Fetching order details from: ${apiUrl}`);
    
    // Call the Flask backend API
    const response = await fetch(apiUrl);
    
    // Log response status
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched order details for order #${orderId}`);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({ error: 'Failed to fetch order details' });
  }
} 