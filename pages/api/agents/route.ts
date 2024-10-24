import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("your_database_name");

  if (req.method === 'GET') {
    try {
      const agents = await db.collection("agents").find({}).toArray();
      res.status(200).json(agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      res.status(500).json({ error: 'Error fetching agents from database' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, prompt } = req.body;

      if (!name || !prompt) {
        return res.status(400).json({ error: 'Name and prompt are required' });
      }

      const result = await db.collection("agents").insertOne({ name, prompt });
      res.status(201).json({ success: true, agent: { name, prompt, _id: result.insertedId } });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Error saving agent to database' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
