import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const db = await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const agents = await db.collection('agents').find().toArray();
        res.status(200).json(agents);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching agents' });
      }
      break;
    case 'POST':
      try {
        const { name, prompt } = req.body;
        const result = await db.collection('agents').insertOne({ name, prompt });
        const insertedAgent = await db.collection('agents').findOne({ _id: result.insertedId });
        res.status(201).json(insertedAgent);
      } catch (error) {
        res.status(500).json({ error: 'Error creating agent' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
