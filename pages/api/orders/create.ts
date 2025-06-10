import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Direct database access disabled - all operations handled by Flask backend
  return res.status(501).json({ 
    error: 'This API endpoint is disabled. Please use the Flask backend API instead.',
    message: 'All database operations are handled by the Flask backend at your deployed API URL.'
  });
} 
