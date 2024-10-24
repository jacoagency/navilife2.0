export interface Message {
  role: 'user' | 'assistant';
  content: string;
  llm?: string;
  type?: 'text' | 'voice' | 'image';
  url?: string;
  // Add any other properties your messages might have
}

