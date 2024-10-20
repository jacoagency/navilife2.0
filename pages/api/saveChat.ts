import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, message, response, isStudioChat } = req.body;

      await client.connect();
      const database = client.db('your_database_name');
      const chats = database.collection('chats');

      await chats.insertMany([
        { ...message, userId, isStudioChat, timestamp: new Date() },
        { ...response, userId, isStudioChat, timestamp: new Date() }
      ]);

      res.status(200).json({ message: 'Chat saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving chat' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
