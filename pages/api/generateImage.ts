import { NextApiRequest, NextApiResponse } from 'next';
import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_KEY,
});

interface FalResult {
  images?: { url: string }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: prompt,
        image_size: "landscape_4_3",
      },
      logs: true,
    }) as FalResult;

    if (result.images && result.images.length > 0) {
      res.status(200).json({ imageUrl: result.images[0].url });
    } else {
      res.status(500).json({ error: 'No images generated' });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Error generating image' });
  }
}
