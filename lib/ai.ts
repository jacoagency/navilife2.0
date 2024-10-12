import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

export async function selectLLM(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/selectLLM', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to select LLM: ${errorData.error}`);
    }

    const data = await response.json();
    console.log('Selected LLM:', data.selectedLLM);
    return data.selectedLLM;
  } catch (error) {
    console.error('Error in selectLLM:', error);
    return 'gemini'; // Default to Gemini if there's an error
  }
}

export async function generateResponse(
  llm: string,
  prompt: string,
  history: any[]
): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ llm, prompt, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to generate response: ${errorData.error}. Details: ${errorData.details}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
}
