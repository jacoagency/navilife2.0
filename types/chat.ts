export interface Message {
  role: 'user' | 'assistant';
  content: string;
  llm?: string;
  type: 'text' | 'image' | 'voice';
  url?: string;
}

