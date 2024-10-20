import { Message } from '@/types/chat';

export async function saveChat(userId: string, message: Message, response: Message, isStudioChat: boolean) {
  try {
    const result = await fetch('/api/saveChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, message, response, isStudioChat }),
    });

    if (!result.ok) {
      throw new Error('Failed to save chat');
    }
  } catch (error) {
    console.error('Error saving chat:', error);
  }
}

export async function getUserHistory(userId: string, isStudioChat: boolean): Promise<Message[]> {
  try {
    const response = await fetch(`/api/getUserHistory?userId=${userId}&isStudioChat=${isStudioChat}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user history');
    }
    const history = await response.json();
    console.log('Fetched history:', history);
    return history;
  } catch (error) {
    console.error('Error fetching user history:', error);
    return [];
  }
}
