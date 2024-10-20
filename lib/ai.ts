import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

export async function selectLLM(prompt: string): Promise<string> {
  try {
    // Check if the prompt is related to image generation
    const imageKeywords = ['generate image', 'create image', 'make an image', 'draw', 'picture of'];
    const isImageRequest = imageKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    if (isImageRequest) {
      console.log('Image generation request detected');
      return 'image';
    }

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
): Promise<string | { type: 'image', url: string }> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ llm, prompt, history }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    if (data.response && typeof data.response === 'object' && 'imageUrl' in data.response) {
      return { type: 'image', url: data.response.imageUrl };
    } else if (typeof data.response === 'string') {
      return data.response;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format from server');
    }
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
}
