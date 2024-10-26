
import { Message } from '@/types/chat';

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
  history: Message[]
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
