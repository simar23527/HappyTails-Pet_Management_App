import { Pool } from 'pg';

// Database configuration
const dbConfig = {
  user: 'postgres',
  password: 'simar232', // Updated to match the PostgreSQL password
  host: 'localhost',
  port: 5432,
  database: 'data', // Updated to match the database name used in Flask backend
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Create a new pool using the configuration
const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { pool }; 