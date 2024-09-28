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

  console.log(`Received request for LLM: ${llm}`);
  console.log(`Prompt: ${prompt}`);
  console.log(`History: ${JSON.stringify(history)}`);

  try {
    let response: string;

    console.log(`Generating response for LLM: ${llm}`);

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

    console.log(`Response generated successfully for ${llm}`);
    console.log(`Response: ${response}`);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error instanceof Error ? error.message : String(error) });
  }
}

async function generateGPTResponse(prompt: string, history: any[]): Promise<string> {
  console.log('Using GPT-3.5-turbo');
  try {
    // Asegúrate de que history sea un array y tenga el formato correcto
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
      role: msg.role || 'user',
      content: msg.content || '' // Usa una cadena vacía si content es null
    })).filter(msg => msg.content !== '') : []; // Filtra los mensajes con contenido vacío

    // Añade el nuevo prompt al final del historial
    formattedHistory.push({ role: 'user', content: prompt });

    console.log('Formatted history:', JSON.stringify(formattedHistory));

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedHistory,
    });
    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error in GPT response:', error);
    throw error;
  }
}

async function generateGeminiResponse(prompt: string): Promise<string> {
  console.log('Using Gemini');
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in Gemini response:', error);
    throw error;
  }
}

async function generateClaudeResponse(prompt: string): Promise<string> {
  console.log('Using Claude');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        model: "claude-2",
        prompt: `Human: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: 300,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error('Error in Claude response:', error);
    throw error;
  }
}

console.log('ANTHROPIC_API_KEY is set:', !!process.env.ANTHROPIC_API_KEY);