import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import * as fal from "@fal-ai/serverless-client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { llm, prompt, history, userMessage } = req.body;

    console.log('Received request:', { llm, prompt, history, userMessage });

    // Handle the original chat room functionality
    if (prompt && userMessage) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ],
      });

      console.log('OpenAI response:', completion.choices[0].message);
      return res.status(200).json({ completion: completion.choices[0].message.content });
    }

    // Handle the new agent functionality
    if (llm && prompt) {
      let response: string | { imageUrl: string };

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
        case 'image':
          response = await generateImage(prompt);
          break;
        default:
          throw new Error(`Unsupported LLM: ${llm}`);
      }

      console.log('LLM response:', response);
      return res.status(200).json({ response });
    }

    console.log('Invalid request parameters');
    return res.status(400).json({ error: 'Invalid request parameters' });
  } catch (error) {
    console.error('Error in request:', error);
    return res.status(500).json({ error: 'Error processing your request', details: error instanceof Error ? error.message : String(error) });
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
    return completion.choices[0].message.content || '';
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

interface FalResult {
  images?: { url: string }[];
}

async function generateImage(prompt: string): Promise<{ imageUrl: string }> {
  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: prompt,
        image_size: "landscape_4_3",
      },
      logs: true,
    }) as FalResult; // Type assertion here

    if (result.images && result.images.length > 0) {
      return { imageUrl: result.images[0].url };
    } else {
      throw new Error('No images generated');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
