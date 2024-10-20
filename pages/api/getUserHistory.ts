import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId, isStudioChat } = req.query;

      await client.connect();
      const database = client.db('your_database_name');
      const chats = database.collection('chats');

      const history = await chats.find({ userId, isStudioChat: isStudioChat === 'true' }).sort({ timestamp: 1 }).toArray();

      console.log('Retrieved history:', history);
      res.status(200).json(history);
    } catch (error) {
      console.error('Error fetching user history:', error);
      res.status(500).json({ error: 'Error fetching user history' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
