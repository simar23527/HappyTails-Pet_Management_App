import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Get the Flask backend URL with cache busting
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return res.status(500).json({ error: 'Backend URL not configured' });
    }
    const timestamp = Date.now();
    
    console.log(`Attempting login to: ${backendUrl}/api/users/login?t=${timestamp}`);
    
    // Forward the request to Flask backend with cache-busting
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${backendUrl}/api/users/login?t=${timestamp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    console.log(`Backend response status: ${response.status}`);
    const data = await response.json();
    console.log(`Backend response data:`, data);

    // Return the response from Flask backend
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Login proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to connect to backend',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
