import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Read queries from the SQL file
    const queriesFilePath = path.join(process.cwd(), 'data', 'queries.sql');
    
    // Check if file exists
    if (!fs.existsSync(queriesFilePath)) {
      return res.status(404).json({ 
        error: 'Queries file not found',
        message: 'Could not find queries.sql file in data directory'
      });
    }
    
    const queriesContent = fs.readFileSync(queriesFilePath, 'utf8');
    
    // Parse queries from SQL file
    const queries = parseQueries(queriesContent);
    
    return res.status(200).json(queries);
  } catch (error: any) {
    console.error('Error loading queries:', error);
    return res.status(500).json({ 
      error: 'Failed to load queries',
      message: error.message 
    });
  }
}

function parseQueries(sqlContent: string) {
  const queryRegex = /^--\s*(.+)$/gm;
  const queries: Record<number, any> = {};
  let currentId = 0;
  
  // Split content by query comments
  const blocks = sqlContent.split(/^--.*$/m).filter(block => block.trim().length > 0);
  const titles = [];
  let match;
  
  // Extract query titles
  while ((match = queryRegex.exec(sqlContent)) !== null) {
    titles.push(match[1].trim());
  }
  
  // Process blocks
  for (let i = 0; i < blocks.length; i++) {
    if (i < titles.length) {
      const sql = blocks[i].trim();
      
      // Skip ALTER TABLE statements
      if (sql.toUpperCase().includes('ALTER TABLE') || !sql) {
        continue;
      }
      
      currentId++;
      queries[currentId] = {
        id: currentId,
        description: titles[i],
        sql: sql
      };
    }
  }
  
  return queries;
} 