import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

type LLMCriteria = {
  name: string;
  prompt: string;
  evaluatePrompt: (userPrompt: string) => Promise<number>;
};

const llmCriteria: LLMCriteria[] = [
  {
    name: 'claude',
    prompt: "You are an AI assistant specialized in coding and programming. Evaluate how well the following user prompt fits your expertise. Respond with a number from 0 to 10, where 10 is a perfect fit and 0 is not relevant at all.",
    evaluatePrompt: async (userPrompt: string) => {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.completions.create({
        model: "claude-2",
        prompt: `${llmCriteria[0].prompt}\n\nUser prompt: ${userPrompt}\n\nScore:`,
        max_tokens_to_sample: 10,
      });
      return parseInt(response.completion.trim()) || 0;
    }
  },
  {
    name: 'gemini',
    prompt: "You are an AI assistant specialized in explanations and general knowledge. Evaluate how well the following user prompt fits your expertise. Respond with a number from 0 to 10, where 10 is a perfect fit and 0 is not relevant at all.",
    evaluatePrompt: async (userPrompt: string) => {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`${llmCriteria[1].prompt}\n\nUser prompt: ${userPrompt}\n\nScore:`);
      const score = parseInt(result.response.text().trim());
      return isNaN(score) ? 0 : score;
    }
  },
  {
    name: 'gpt',
    prompt: "You are a general-purpose AI assistant. Evaluate how well the following user prompt fits your expertise. Respond with a number from 0 to 10, where 10 is a perfect fit and 0 is not relevant at all.",
    evaluatePrompt: async (userPrompt: string) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: llmCriteria[2].prompt },
          { role: "user", content: userPrompt },
        ],
      });
      const score = parseInt(completion.choices[0].message.content?.trim() || "0");
      return isNaN(score) ? 0 : score;
    }
  }
];

export async function selectLLM(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/selectLLM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to select LLM: ${errorData.error}`);
    }

    const data = await response.json();
    console.log('Selected LLM:', data.selectedLLM); // Añade este log
    return data.selectedLLM;
  } catch (error) {
    console.error('Error in selectLLM:', error);
    return 'gpt'; // Default to GPT if there's an error
  }
}

export async function generateResponse(llm: string, prompt: string, history: any[]): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

function createPrompt(llm: string, input: string, history: any[]): string {
  const contextPrompt = `You are an AI assistant specialized in ${llm === 'claude' ? 'coding and programming' : llm === 'gemini' ? 'explanations and general knowledge' : 'general conversation'}. 
  The user's chat history and preferences are: ${JSON.stringify(history)}. 
  Please provide a helpful and engaging response.`;

  return `${contextPrompt}\n\nUser: ${input}\nAI:`;
}