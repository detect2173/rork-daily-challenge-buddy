import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function Index() {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Wait for auth to initialize before redirecting
  if (!isInitialized) {
    return null;
  }

  // Redirect to login if not authenticated, otherwise to home
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
}