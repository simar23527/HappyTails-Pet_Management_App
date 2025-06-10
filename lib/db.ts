// Database connection disabled for production deployment
// All database operations are handled by the Flask backend API
export const pool = {
  query: () => {
    throw new Error('Direct database access disabled. Use the Flask API instead.');
  }
}; 
