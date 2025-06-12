import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Challenge, UserState, Recommendation, SkillTest } from '@/types/challenge';
import { generateRecommendationsFromHistory } from '@/utils/recommendations';
import { generateSkillTest } from '@/utils/skillTest';
import { useAuthStore } from './useAuthStore';

// Mock data for demo purposes
const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    prompt: 'public speaking',
    lesson: "Public speaking is a skill that improves with practice. Regular exposure to speaking situations helps reduce anxiety and build confidence.",
    challenge: "Record yourself giving a 2-minute presentation on a topic you are passionate about. Watch it back and note one thing you did well.",
    completed: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: 'challenge-2',
    prompt: 'meditation',
    lesson: "Meditation helps train your attention and awareness. Even short sessions can improve focus and reduce stress levels.",
    challenge: "Practice 5 minutes of mindful breathing today. Focus only on your breath, and gently return your attention whenever your mind wanders.",
    completed: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 'challenge-3',
    prompt: 'coding',
    lesson: "Consistent practice is key to coding mastery. Breaking down complex problems into smaller parts makes them more manageable.",
    challenge: "Solve one small coding challenge today. Focus on writing clean, readable code rather than the fastest solution.",
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

interface AppState {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  isLoading: boolean;
  error: string | null;
  user: UserState;
  recommendations: Recommendation[];
  currentPrompt: string;
  skillTests: SkillTest[];
  currentTest: SkillTest | null;
  
  // Actions
  fetchChallenges: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  setCurrentChallenge: (challenge: Challenge) => void;
  addChallenge: (challenge: Challenge) => Promise<void>;
  markChallengeComplete: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetDailyChallenge: () => Promise<void>;
  generateRecommendations: () => void;
  setPromptFromRecommendation: (recommendation: Recommendation) => void;
  setCurrentPrompt: (prompt: string) => void;
  createSkillTest: (skillArea: string) => Promise<void>;
  setCurrentTest: (test: SkillTest | null) => void;
  submitTestAnswer: (questionId: string, answer: string) => void;
  completeSkillTest: (testId: string, score: number) => Promise<void>;
  updateUser: (userData: Partial<UserState>) => Promise<void>;
}

// Helper to check if it's a new day
const isNewDay = (lastDate: string | null): boolean => {
  if (!lastDate) return true;
  
  const lastCompletedDate = new Date(lastDate);
  const today = new Date();
  
  return (
    lastCompletedDate.getDate() !== today.getDate() ||
    lastCompletedDate.getMonth() !== today.getMonth() ||
    lastCompletedDate.getFullYear() !== today.getFullYear()
  );
};

export const useStore = create<AppState>()((set, get) => ({
  challenges: [],
  currentChallenge: null,
  isLoading: false,
  error: null,
  recommendations: [],
  currentPrompt: '',
  skillTests: [],
  currentTest: null,
  user: {
    streak: 3,
    lastCompletedDate: new Date().toISOString(),
    isPremium: false,
    challengesRemaining: 1,
  },
  
  fetchChallenges: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // For demo purposes, use mock data
      // In a real app, you would fetch from Firestore
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        challenges: mockChallenges, 
        isLoading: false 
      });
      
      // Set current challenge to the most recent incomplete challenge
      const currentChallenge = mockChallenges.find(c => !c.completed);
      if (currentChallenge) {
        set({ currentChallenge });
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      set({ error: 'Failed to load challenges', isLoading: false });
    }
  },
  
  fetchUserData: async () => {
    try {
      // For demo purposes, use mock data
      // In a real app, you would fetch from Firestore
      
      set({
        user: {
          streak: 3,
          lastCompletedDate: new Date().toISOString(),
          isPremium: false,
          challengesRemaining: 1,
        }
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  },
  
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
  
  addChallenge: async (challenge) => {
    set({ isLoading: true, error: null });
    
    try {
      // For demo purposes, just add to local state
      // In a real app, you would add to Firestore
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newChallenge = {
        ...challenge,
        id: `challenge-${Date.now()}`,
      };
      
      // Update user's challenges remaining
      const { user: appUser } = get();
      
      set((state) => ({
        challenges: [newChallenge, ...state.challenges],
        currentChallenge: newChallenge,
        user: {
          ...state.user,
          challengesRemaining: state.user.isPremium ? state.user.challengesRemaining : state.user.challengesRemaining - 1
        },
        isLoading: false
      }));
    } catch (error) {
      console.error('Error adding challenge:', error);
      set({ error: 'Failed to create challenge', isLoading: false });
    }
  },
  
  markChallengeComplete: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const today = new Date().toISOString();
      
      // For demo purposes, just update local state
      // In a real app, you would update Firestore
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user streak
      const { user: appUser } = get();
      const isNewDayToday = isNewDay(appUser.lastCompletedDate);
      let newStreak = appUser.streak;
      
      if (isNewDayToday) {
        newStreak += 1;
      }
      
      // Update local state
      set((state) => {
        const updatedChallenges = state.challenges.map(challenge => 
          challenge.id === id ? { ...challenge, completed: true } : challenge
        );
        
        return {
          challenges: updatedChallenges,
          user: {
            ...state.user,
            streak: newStreak,
            lastCompletedDate: today,
          },
          isLoading: false
        };
      });
    } catch (error) {
      console.error('Error marking challenge complete:', error);
      set({ error: 'Failed to update challenge', isLoading: false });
    }
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  resetDailyChallenge: async () => {
    const { user: appUser } = get();
    const isNewDayToday = isNewDay(appUser.lastCompletedDate);
    
    if (isNewDayToday) {
      try {
        // For demo purposes, just update local state
        // In a real app, you would update Firestore
        
        // Update local state
        set((state) => ({
          user: {
            ...state.user,
            challengesRemaining: state.user.isPremium ? Infinity : 1
          }
        }));
      } catch (error) {
        console.error('Error resetting daily challenge:', error);
      }
    }
  },

  generateRecommendations: () => {
    const { challenges } = get();
    if (challenges.length === 0) return;

    const recommendations = generateRecommendationsFromHistory(challenges);
    set({ recommendations });
  },

  setPromptFromRecommendation: (recommendation) => {
    set({ currentPrompt: recommendation.prompt });
  },

  setCurrentPrompt: (prompt) => {
    set({ currentPrompt: prompt });
  },

  createSkillTest: async (skillArea) => {
    const { user: appUser } = get();
    
    if (!appUser.isPremium) {
      set({ error: "Premium subscription required to access skill tests" });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const { challenges } = get();
      const test = await generateSkillTest(skillArea, challenges);
      
      // For demo purposes, just update local state
      // In a real app, you would add to Firestore
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTest = {
        ...test,
        id: `test-${Date.now()}`
      };
      
      set((state) => ({
        skillTests: [newTest, ...state.skillTests],
        currentTest: newTest,
        isLoading: false
      }));
    } catch (err) {
      set({ 
        error: "Failed to generate skill test. Please try again.",
        isLoading: false
      });
      console.error(err);
    }
  },

  setCurrentTest: (test) => set({ currentTest: test }),

  submitTestAnswer: (questionId, answer) => {
    set((state) => {
      if (!state.currentTest) return state;
      
      const updatedQuestions = state.currentTest.questions.map(q => 
        q.id === questionId ? { ...q, userAnswer: answer } : q
      );
      
      const updatedTest = {
        ...state.currentTest,
        questions: updatedQuestions
      };
      
      return {
        currentTest: updatedTest,
        skillTests: state.skillTests.map(test => 
          test.id === updatedTest.id ? updatedTest : test
        )
      };
    });
  },

  completeSkillTest: async (testId, score) => {
    set({ isLoading: true, error: null });
    
    try {
      // For demo purposes, just update local state
      // In a real app, you would update Firestore
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      set((state) => {
        const updatedTests = state.skillTests.map(test => 
          test.id === testId ? { ...test, completed: true, score } : test
        );
        
        return {
          skillTests: updatedTests,
          currentTest: null,
          isLoading: false
        };
      });
    } catch (error) {
      console.error('Error completing skill test:', error);
      set({ error: 'Failed to complete test', isLoading: false });
    }
  },

  updateUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      // For demo purposes, just update local state
      // In a real app, you would update Firestore
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      set((state) => ({
        user: {
          ...state.user,
          ...userData
        },
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      set({ error: 'Failed to update user data', isLoading: false });
    }
  }
}));