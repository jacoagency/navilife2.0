import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const client = await clientPromise;
      const db = client.db("your_database_name");
      const agent = await db.collection("agents").findOne({ _id: new ObjectId(id as string) });

      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }

      res.status(200).json({
        id: agent._id.toString(),
        name: agent.name,
        prompt: agent.prompt,
      });
    } catch (error) {
      console.error('Failed to fetch agent:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = client.db("your_database_name");
      const result = await db.collection("agents").deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Agent not found' });
      }

      res.status(200).json({ message: 'Agent deleted successfully' });
    } catch (error) {
      console.error('Failed to delete agent:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
