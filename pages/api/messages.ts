import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { generateGPTResponse } from "@/lib/gptModel";
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/mongodb';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { agentId, message } = req.body;

    // Broadcast the user's message
    await pusher.trigger(`chat-${agentId}`, 'message', message);

    // Generate and broadcast the agent's response
    const agent = await fetchAgent(agentId);
    if (agent && agent.prompt) {
      const agentResponse = await generateGPTResponse(agent.prompt, message.content);
      const agentMessage = {
        content: agentResponse,
        sender: 'agent',
      };
      await pusher.trigger(`chat-${agentId}`, 'message', agentMessage);

      res.status(200).json({ message: 'Messages sent successfully' });
    } else {
      res.status(404).json({ error: 'Agent not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function fetchAgent(agentId: string) {
  const db = await connectToDatabase();
  return await db.collection('agents').findOne({ _id: new ObjectId(agentId) });
}
