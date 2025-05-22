import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set JSON content type header
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  console.log('Received query execution request for ID:', id);
  
  if (!id || isNaN(Number(id))) {
    console.error('Invalid query ID:', id);
    return res.status(400).json({ error: 'Valid query ID is required' });
  }

  let client;
  try {
    // Read queries from the SQL file
    const queriesFilePath = path.join(process.cwd(), 'data', 'queries.sql');
    console.log('Looking for queries file at:', queriesFilePath);
    
    // Check if file exists
    if (!fs.existsSync(queriesFilePath)) {
      console.error('Queries file not found at:', queriesFilePath);
      return res.status(404).json({ 
        error: 'Queries file not found',
        message: 'Could not find queries.sql file in data directory'
      });
    }
    
    const queriesContent = fs.readFileSync(queriesFilePath, 'utf8');
    console.log('Successfully read queries file');
    
    // Parse queries from SQL file
    const queries = parseQueries(queriesContent);
    const queryId = Number(id);
    console.log('Found queries:', Object.keys(queries));
    
    if (!queries[queryId]) {
      console.error('Query not found for ID:', queryId);
      return res.status(404).json({ error: `Query with ID ${queryId} not found` });
    }
    
    const sql = queries[queryId].sql;
    console.log('Found query:', { id: queryId, sql });
    
    // Get a client from the pool
    console.log('Attempting to connect to database...');
    client = await pool.connect();
    console.log('Database client connected');
    
    // Execute the SQL query
    console.log(`Executing query ID ${queryId}:`, sql);
    const result = await client.query(sql);
    console.log('Query executed successfully, rows returned:', result.rowCount);
    
    // Return the results
    return res.status(200).json({
      id: queryId,
      description: queries[queryId].description,
      sql: sql,
      results: result.rows || []
    });
  } catch (error: any) {
    console.error('Error executing query:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      error: 'Failed to execute query',
      message: error.message,
      details: error.stack,
      queryId: id
    });
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
      console.log('Database client released');
    }
  }
}

function parseQueries(sqlContent: string) {
  console.log('Starting to parse queries...');
  const queryRegex = /^--\s*(.+)$/gm;
  const queries: Record<number, { id: number; description: string; sql: string }> = {};
  let currentId = 0;
  
  // Split content by query comments
  const blocks = sqlContent.split(/^--.*$/m).filter(block => block.trim().length > 0);
  const titles = [];
  let match;
  
  // Extract query titles
  while ((match = queryRegex.exec(sqlContent)) !== null) {
    titles.push(match[1].trim());
  }
  
  console.log('Found titles:', titles);
  
  // Process blocks
  for (let i = 0; i < blocks.length; i++) {
    if (i < titles.length) {
      const sql = blocks[i].trim();
      
      // Skip ALTER TABLE statements
      if (sql.toUpperCase().includes('ALTER TABLE') || !sql) {
        console.log('Skipping ALTER TABLE statement');
        continue;
      }
      
      currentId++;
      queries[currentId] = {
        id: currentId,
        description: titles[i],
        sql: sql
      };
      console.log(`Added query ${currentId}:`, { description: titles[i], sql });
    }
  }
  
  console.log('Finished parsing queries:', queries);
  return queries;
} 