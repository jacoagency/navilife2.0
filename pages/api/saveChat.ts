import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('your_database_name');
    const collection = db.collection('chats');
    
    const { userId, message, response } = req.body;
    await collection.insertOne({ userId, message, response, timestamp: new Date() });
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}