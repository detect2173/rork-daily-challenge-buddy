export interface Challenge {
  id: string;
  prompt: string;
  lesson: string;
  challenge: string;
  completed: boolean;
  createdAt: string;
}

export interface UserState {
  streak: number;
  lastCompletedDate: string | null;
  isPremium: boolean;
  challengesRemaining: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  relatedTo: string[];
}

export interface SkillTest {
  id: string;
  skillArea: string;
  questions: SkillQuestion[];
  createdAt: string;
  completed: boolean;
  score?: number;
}

export interface SkillQuestion {
  id: string;
  question: string;
  options?: string[];
  type: 'multiple-choice' | 'reflection' | 'action';
  userAnswer?: string;
  correctAnswer?: string;
}