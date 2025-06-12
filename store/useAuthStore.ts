import { create } from 'zustand';
import * as WebBrowser from 'expo-web-browser';
import { Platform, Alert } from 'react-native';

// Mock Firebase types for demo purposes
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

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
  
  initializeAuth: async () => {
    try {
      // For demo purposes, simulate a logged-in user
      const mockUser: User = {
        uid: 'mock-user-id-123',
        email: 'user@example.com',
        displayName: 'Demo User',
        photoURL: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop'
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isInitialized: true 
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isInitialized: true });
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // For demo purposes, simulate successful login
      const mockUser: User = {
        uid: 'mock-user-id-123',
        email: email,
        displayName: 'Demo User',
        photoURL: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop'
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = 'Invalid email or password';
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // For demo purposes, simulate successful Google login
      const mockUser: User = {
        uid: 'mock-google-user-id-456',
        email: 'google-user@example.com',
        displayName: 'Google User',
        photoURL: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop'
      };
      
      set({ 
        user: mockUser, 
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
      // For demo purposes, simulate successful registration
      const mockUser: User = {
        uid: 'mock-new-user-id-789',
        email: email,
        displayName: name,
        photoURL: null
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  signOut: async () => {
    set({ isLoading: true });
    
    try {
      // For demo purposes, just clear the user state
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
      
      // For demo purposes, just update the local user state
      const updatedUser = {
        ...user,
        ...data
      };
      
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
}));