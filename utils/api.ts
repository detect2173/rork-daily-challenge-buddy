import { Challenge } from '@/types/challenge';

interface ApiResponse {
  completion: string;
}

export const generateChallenge = async (prompt: string): Promise<Challenge> => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that creates personalized daily challenges.'
      },
      {
        role: 'user',
        content: `Create a daily learning challenge for someone who wants to improve: "${prompt}". Include: 1) a brief, motivating explanation (2 sentences), and 2) one simple, doable action challenge. Keep it positive, short, and encouraging. Format your response as JSON with "lesson" and "challenge" fields.`
      }
    ];

    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate challenge');
    }

    const data: ApiResponse = await response.json();
    
    // Parse the completion as JSON
    let parsedData;
    try {
      parsedData = JSON.parse(data.completion);
    } catch (e) {
      // If parsing fails, try to extract the content using regex
      const lessonMatch = data.completion.match(/\"lesson\"\s*:\s*\"(.*?)\"/);
      const challengeMatch = data.completion.match(/\"challenge\"\s*:\s*\"(.*?)\"/);
      
      parsedData = {
        lesson: lessonMatch ? lessonMatch[1] : "Here's your daily insight.",
        challenge: challengeMatch ? challengeMatch[1] : "Complete your challenge for today."
      };
    }

    return {
      id: Date.now().toString(),
      prompt,
      lesson: parsedData.lesson,
      challenge: parsedData.challenge,
      completed: false,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating challenge:', error);
    throw error;
  }
};