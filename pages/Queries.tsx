import React, { useState, useEffect } from 'react';
import { getAllQueries, executeQuery } from '../data/apiService';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import Link from 'next/link';

interface QueryData {
  id: number;
  description: string;
  sql: string;
  results?: any[];
}

interface QueriesState {
  [key: number]: QueryData;
}

const Queries = () => {
  const [queries, setQueries] = useState<QueriesState>({});
  const [activeQuery, setActiveQuery] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [executedQueries, setExecutedQueries] = useState<{ 
    [key: number]: { 
      results: any[], 
      executing: boolean,
      error: string | null 
    } 
  }>({});

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const data = await getAllQueries();
        setQueries(data);
        if (Object.keys(data).length > 0) {
          setActiveQuery(parseInt(Object.keys(data)[0]));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load queries');
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleExecuteQuery = async (queryId: number) => {
    try {
      setExecutedQueries(prev => ({
        ...prev,
        [queryId]: { 
          ...prev[queryId], 
          executing: true, 
          error: null 
        }
      }));
      
      console.log(`Executing query ID ${queryId}`);
      
      // Special handling for query 12 (treats query) - add extra logging
      if (queryId === 12) {
        console.log("Executing shopping category query");
        console.log("This query looks for categories with 'Treats' in the name");
        console.log("Please check your browser console for detailed logs");
      }
      
      const result = await executeQuery(queryId);
      console.log('Query result:', result);
      
      if (!result.results || result.results.length === 0) {
        // For query 12, provide more specific details about potential issues
        if (queryId === 12) {
          const errorMsg = "The query executed successfully but returned no results. This likely means there are no categories containing 'Treats' in your database, or PostgreSQL's ILIKE operator is handling the pattern match differently than expected.";
          setExecutedQueries(prev => ({
            ...prev,
            [queryId]: { 
              results: [], 
              executing: false, 
              error: errorMsg
            }
          }));
        } else {
          setExecutedQueries(prev => ({
            ...prev,
            [queryId]: { 
              results: [], 
              executing: false, 
              error: 'The query executed successfully but returned no results.' 
            }
          }));
        }
        return;
      }
      
      setExecutedQueries(prev => ({
        ...prev,
        [queryId]: { 
          results: result.results, 
          executing: false, 
          error: null 
        }
      }));
    } catch (err: any) {
      console.error('Query execution error:', err);
      
      setExecutedQueries(prev => ({
        ...prev,
        [queryId]: { 
          ...prev[queryId], 
          executing: false, 
          error: err.message || 'Failed to execute query' 
        }
      }));
    }
  };

  const handleTabClick = (queryId: number) => {
    setActiveQuery(queryId);
  };

  // Add this function to handle special case error messaging  
  const getErrorMessage = (queryId: number, error: string) => {
    // Special case for treats query
    if (queryId === 12 && error.includes("returned no results")) {
      return (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">
          <h3 className="font-medium mb-2">The query executed successfully but returned no results.</h3>
          <p>This could be because:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>There are no categories containing "Treats" in the database</li>
            <li>There are no products assigned to categories containing "Treats"</li>
            <li>Case sensitivity might be affecting the ILIKE operator</li>
          </ul>
          <p className="mt-2">Try checking the ShoppingCategory table in your database to verify if "Treats" categories exist.</p>
        </div>
      );
    }
    
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
        {error}
      </div>
    );
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading queries...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  // Get the active query object
  const currentQuery = activeQuery ? queries[activeQuery] : null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Happy Tales SQL Query Interface</h1>
        <div>
          <Link href="/">
            <Button variant="outline" className="mr-2">Back to Home</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.keys(queries).length > 0 ? (
          <div>
            {/* Custom Tab Navigation */}
            <div className="flex overflow-x-auto mb-4 bg-gray-100 p-1 rounded-md">
              {Object.values(queries).map((query) => (
                <button
                  key={query.id}
                  onClick={() => handleTabClick(query.id)}
                  className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors
                    ${activeQuery === query.id 
                      ? 'bg-white text-purple-700 shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Query {query.id}
                </button>
              ))}
            </div>

            {/* Content for active tab */}
            {currentQuery && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  Query {currentQuery.id}: {currentQuery.description}
                </h2>
                <Separator className="my-3" />
                
                <div className="bg-slate-800 text-white p-4 rounded-md my-4 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{currentQuery.sql}</pre>
                </div>
                
                <Button 
                  onClick={() => handleExecuteQuery(currentQuery.id)}
                  disabled={executedQueries[currentQuery.id]?.executing}
                  className="mt-2 bg-purple-600 hover:bg-purple-700"
                >
                  {executedQueries[currentQuery.id]?.executing ? 'Executing...' : 'Execute Query'}
                </Button>

                {executedQueries[currentQuery.id]?.error && (
                  getErrorMessage(currentQuery.id, executedQueries[currentQuery.id].error)
                )}

                {executedQueries[currentQuery.id]?.results && executedQueries[currentQuery.id].results.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Results</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            {executedQueries[currentQuery.id].results.length > 0 && 
                              Object.keys(executedQueries[currentQuery.id].results[0]).map((column, index) => (
                                <th key={index} className="py-2 px-4 border-b border-r text-left">
                                  {column}
                                </th>
                              ))
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {executedQueries[currentQuery.id].results.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              {Object.keys(executedQueries[currentQuery.id].results[0]).map((column) => (
                                <td key={column} className="py-2 px-4 border-b border-r">
                                  {row[column]?.toString() || 'NULL'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {executedQueries[currentQuery.id]?.results && executedQueries[currentQuery.id].results.length === 0 && !executedQueries[currentQuery.id]?.error && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md">
                    The query executed successfully but returned no results.
                  </div>
                )}
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl">No queries available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queries; 