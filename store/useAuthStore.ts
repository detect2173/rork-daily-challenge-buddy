import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

// User type definition
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Mock user database for demo purposes
const mockUsers = [
  {
    uid: 'user-1',
    email: 'demo@example.com',
    password: 'password123',
    displayName: 'Demo User',
    photoURL: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,
      
      initializeAuth: async () => {
        try {
          // Check if we have a stored user
          const storedUser = await AsyncStorage.getItem('auth_user');
          
          if (storedUser) {
            const user = JSON.parse(storedUser);
            set({ 
              user, 
              isAuthenticated: true, 
              isInitialized: true 
            });
          } else {
            set({ isInitialized: true });
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({ isInitialized: true });
        }
      },
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user in mock database
          const user = mockUsers.find(u => 
            u.email === email && u.password === password
          );
          
          if (!user) {
            throw new Error('Invalid email or password');
          }
          
          const authUser: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          
          // Store user in AsyncStorage
          await AsyncStorage.setItem('auth_user', JSON.stringify(authUser));
          
          set({ 
            user: authUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          console.error('Sign in error:', error);
          
          set({ 
            error: error.message || 'Invalid email or password', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo, just use a mock Google user
          const authUser: User = {
            uid: 'google-user-1',
            email: 'google-user@example.com',
            displayName: 'Google User',
            photoURL: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop'
          };
          
          // Store user in AsyncStorage
          await AsyncStorage.setItem('auth_user', JSON.stringify(authUser));
          
          set({ 
            user: authUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          console.error('Google sign in error:', error);
          
          set({ 
            error: 'Google sign in failed', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          if (mockUsers.some(u => u.email === email)) {
            throw new Error('Email already in use');
          }
          
          // Create new user
          const newUser = {
            uid: `user-${Date.now()}`,
            email,
            password,
            displayName: name,
            photoURL: null
          };
          
          // In a real app, we would add this user to the database
          // For demo, we'll just create the auth user
          
          const authUser: User = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            photoURL: newUser.photoURL
          };
          
          // Store user in AsyncStorage
          await AsyncStorage.setItem('auth_user', JSON.stringify(authUser));
          
          set({ 
            user: authUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          console.error('Registration error:', error);
          
          set({ 
            error: error.message || 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      signOut: async () => {
        set({ isLoading: true });
        
        try {
          // Remove user from AsyncStorage
          await AsyncStorage.removeItem('auth_user');
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Sign out error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      updateProfile: async (data) => {
        set({ isLoading: true });
        
        try {
          const { user } = get();
          
          if (!user) {
            throw new Error('No user logged in');
          }
          
          const updatedUser = {
            ...user,
            ...data
          };
          
          // Update user in AsyncStorage
          await AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Update profile error:', error);
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);