import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
    const form = new formidable.IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      console.log('Fields:', fields);
      console.log('Files:', files);

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const prompt = Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt;
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      if (!name || !prompt || !file) {
        return res.status(400).json({ error: 'Name, prompt, and image are required' });
      }

      const fileName = file.newFilename;
      const imageUrl = `/uploads/${fileName}`;

      try {
        const result = await db.collection("agents").insertOne({ name, prompt, imageUrl });
        res.status(201).json({ success: true, agent: { name, prompt, imageUrl, _id: result.insertedId } });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Error saving agent to database' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
