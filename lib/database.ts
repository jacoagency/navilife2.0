export async function saveChat(userId: string, message: any, response: any) {
  await fetch('/api/saveChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, message, response }),
  });
}

export async function getUserHistory(userId: string) {
  const response = await fetch('/api/getUserHistory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  return response.json();
}