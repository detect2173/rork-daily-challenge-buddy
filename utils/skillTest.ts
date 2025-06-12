import { Challenge, SkillTest, SkillQuestion } from '@/types/challenge';

interface ApiResponse {
  completion: string;
}

export const generateSkillTest = async (skillArea: string, challenges: Challenge[]): Promise<SkillTest> => {
  try {
    // Find related challenges to provide context
    const relatedChallenges = challenges
      .filter(challenge => 
        challenge.prompt.toLowerCase().includes(skillArea.toLowerCase()) ||
        challenge.lesson.toLowerCase().includes(skillArea.toLowerCase()) ||
        challenge.challenge.toLowerCase().includes(skillArea.toLowerCase())
      )
      .slice(0, 3);
    
    const challengeContext = relatedChallenges.length > 0 
      ? `Based on these previous challenges: ${relatedChallenges.map(c => `"${c.challenge}"`).join(", ")}`
      : "";

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that creates skill assessment tests.'
      },
      {
        role: 'user',
        content: `Create a skill test for "${skillArea}". ${challengeContext} 
        
        Include 5 questions that help the user assess their progress in this skill area. Mix of:
        - 2 multiple-choice questions with 4 options each
        - 2 reflection questions that ask the user to think about their progress
        - 1 action-based question that asks the user to perform a specific task
        
        Format your response as JSON with this structure:
        {
          "questions": [
            {
              "id": "q1",
              "question": "Question text",
              "type": "multiple-choice",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": "Option A"
            },
            {
              "id": "q2",
              "question": "Reflection question",
              "type": "reflection"
            },
            {
              "id": "q3",
              "question": "Action question",
              "type": "action"
            }
          ]
        }`
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
      throw new Error('Failed to generate skill test');
    }

    const data: ApiResponse = await response.json();
    
    // Parse the completion as JSON
    let parsedData;
    try {
      parsedData = JSON.parse(data.completion);
    } catch (e) {
      // If parsing fails, create a default test
      parsedData = {
        questions: [
          {
            id: "q1",
            question: `What's your current level of confidence with ${skillArea}?`,
            type: "multiple-choice",
            options: ["Beginner", "Intermediate", "Advanced", "Expert"],
            correctAnswer: null
          },
          {
            id: "q2",
            question: `What's the biggest challenge you face when practicing ${skillArea}?`,
            type: "reflection"
          },
          {
            id: "q3",
            question: `What's one improvement you've noticed in your ${skillArea} skills?`,
            type: "reflection"
          },
          {
            id: "q4",
            question: `Which of these techniques have you tried for ${skillArea}?`,
            type: "multiple-choice",
            options: ["Practice daily", "Learn from experts", "Get feedback", "Teach others"],
            correctAnswer: null
          },
          {
            id: "q5",
            question: `Try practicing ${skillArea} for 5 minutes right now. How did it go?`,
            type: "action"
          }
        ]
      };
    }

    // Ensure each question has an ID
    const questions: SkillQuestion[] = parsedData.questions.map((q: any, index: number) => ({
      ...q,
      id: q.id || `q${index + 1}`
    }));

    return {
      id: `test-${Date.now()}`,
      skillArea,
      questions,
      createdAt: new Date().toISOString(),
      completed: false
    };
  } catch (error) {
    console.error('Error generating skill test:', error);
    throw error;
  }
};