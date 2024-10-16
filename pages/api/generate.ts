import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { llm, prompt, history } = req.body;

  if (!llm || !prompt) {
    return res.status(400).json({ error: 'LLM and prompt are required' });
  }

  try {
    let response: string;

    switch (llm) {
      case 'gpt':
        response = await generateGPTResponse(prompt, history);
        break;
      case 'gemini':
        response = await generateGeminiResponse(prompt);
        break;
      case 'claude':
        response = await generateClaudeResponse(prompt);
        break;
      default:
        throw new Error(`Unsupported LLM: ${llm}`);
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

async function generateGPTResponse(prompt: string, history: any[]): Promise<string> {
  try {
    const formattedHistory = Array.isArray(history)
      ? history
          .map((msg) => ({
            role: msg.role || 'user',
            content: msg.content || '',
          }))
          .filter((msg) => msg.content.trim() !== '')
      : [];

    formattedHistory.push({ role: 'user', content: prompt });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: formattedHistory,
    });
    return completion.choices[0].message?.content || '';
  } catch (error) {
    console.error('Error in GPT response:', error);
    throw error;
  }
}

async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Si la respuesta contiene información detallada sobre la imagen, la reemplazamos
    if (response.includes("File:") && response.includes("Dimensions:")) {
      return "Image generated successfully.";
    }
    
    return response;
  } catch (error) {
    console.error('Error in Gemini response:', error);
    throw error;
  }
}

async function generateClaudeResponse(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }
  try {
    const response = await anthropic.completions.create({
      model: 'claude-2',
      prompt: `Human: ${prompt}\n\nAssistant:`,
      max_tokens_to_sample: 300,
    });

    return response.completion.trim();
  } catch (error) {
    console.error('Error in Claude response:', error);
    throw error;
  }
}
