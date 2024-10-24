import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const llmNames = ['claude', 'gpt', 'gemini', 'image'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant that selects the most appropriate LLM for a given question.
You have four options:
- "claude": Specialized in code, programming, algorithms, and software development.
- "gpt": Expert in detailed explanations and complex logical reasoning.
- "gemini": General-purpose assistant for any other query.
- "image": For generating, creating, or manipulating images.

Based on the user's question, select the most appropriate LLM according to these rules:
- If the query is related to code, programming, or algorithms, select "claude".
- If the query requires detailed explanations or involves complex logical reasoning, select "gpt".
- If the query is about generating, creating, or manipulating images, select "image".
- For any other query or if it's not clear which category it belongs to, select "gemini".

Respond only with the exact name of the selected LLM in lowercase, without any additional text or explanation.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 5,
      temperature: 0.0,
    });

    const assistantResponse = completion.choices[0].message?.content?.trim().toLowerCase() || '';
    console.log('Assistant response:', assistantResponse);

    // Ensure the assistant's response is one of the expected LLM names
    const selectedLLM = llmNames.includes(assistantResponse) ? assistantResponse : 'gemini';

    console.log('Final selected LLM:', selectedLLM);
    res.status(200).json({ selectedLLM });
  } catch (error) {
    console.error('Error selecting LLM:', error);
    res.status(500).json({
      error: 'Failed to select LLM',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
