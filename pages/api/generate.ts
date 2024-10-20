import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt, userMessage } = await req.json();

    if (!prompt || !userMessage) {
      return new Response('Prompt and userMessage are required', { status: 400 });
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userMessage }
      ],
    });

    const data = await response.json();
    const completion = data.choices[0].message.content;

    return new Response(JSON.stringify({ completion }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in OpenAI request:', error);
    return new Response('Error processing your request', { status: 500 });
  }
}
