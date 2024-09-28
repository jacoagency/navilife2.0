import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.MONGODB_URI) {
    res.status(500).json({ error: 'MongoDB URI is not defined' });
    return;
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    // Perform MongoDB operations here
    // ...
    res.status(200).json({ /* your response */ });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await client.close();
  }
}