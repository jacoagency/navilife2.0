import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req;
  const db = await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const agent = await db.collection('agents').findOne({ _id: new ObjectId(id as string) });
        if (!agent) {
          return res.status(404).json({ error: 'Agent not found' });
        }
        res.status(200).json(agent);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching agent' });
      }
      break;
    case 'DELETE':
      try {
        const result = await db.collection('agents').deleteOne({ _id: new ObjectId(id as string) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Agent not found' });
        }
        res.status(200).json({ message: 'Agent deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting agent' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
