import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let client;
  try {
    const orderData = req.body;
    console.log('Received order data:', orderData);

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!orderData.username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Get a client from the pool
    client = await pool.connect();
    console.log('Database client connected');

    // Start a transaction
    await client.query('BEGIN');
    console.log('Transaction started');

    // Insert the main order
    const orderResult = await client.query(
      `INSERT INTO Orders (
        Username, 
        StoreID,
        Status
      ) VALUES ($1, $2, $3) 
      RETURNING OrderID`,
      [
        orderData.username,
        orderData.storeId || 1,
        'Pending'
      ]
    );

    const orderId = orderResult.rows[0].orderid;
    console.log('Created order with ID:', orderId);

    // Insert order details
    for (const item of orderData.items) {
      console.log('Inserting order detail:', item);
      await client.query(
        `INSERT INTO OrderDetails (
          OrderID,
          ProductID,
          Quantity
        ) VALUES ($1, $2, $3)`,
        [
          orderId,
          item.product_id,
          item.quantity
        ]
      );
    }

    // Commit the transaction
    await client.query('COMMIT');
    console.log('Order created successfully');

    return res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: orderId 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Rollback the transaction if we have a client
    if (client) {
      try {
        await client.query('ROLLBACK');
        console.log('Transaction rolled back');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
    }

    return res.status(500).json({ 
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
      console.log('Database client released');
    }
  }
} 