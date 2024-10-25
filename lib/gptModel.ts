import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateGPTResponse(prompt: string, userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 150,
      n: 1,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating GPT response:', error);
    throw error;
  }
}
