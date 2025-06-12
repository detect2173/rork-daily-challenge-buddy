import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ChallengeCard } from '@/components/ChallengeCard';
import { StreakIndicator } from '@/components/StreakIndicator';
import { EmptyState } from '@/components/EmptyState';
import { PremiumBanner } from '@/components/PremiumBanner';
import { generateChallenge } from '@/utils/api';
import { colors } from '@/constants/colors';
import { Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user: authUser } = useAuthStore();
  const { 
    currentChallenge, 
    isLoading, 
    error, 
    user,
    currentPrompt,
    addChallenge,
    markChallengeComplete,
    setLoading,
    setError,
    resetDailyChallenge,
    setCurrentPrompt,
    fetchChallenges,
    fetchUserData
  } = useStore();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    
    // Reset daily challenge count if it's a new day
    resetDailyChallenge();
  }, [isAuthenticated]);

  const handleGenerateChallenge = async () => {
    if (!currentPrompt.trim()) {
      Alert.alert('Please enter what you want to improve');
      return;
    }

    if (user.challengesRemaining <= 0 && !user.isPremium) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily challenge limit. Upgrade to premium for unlimited challenges.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: handlePremiumPress }
        ]
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const challenge = await generateChallenge(currentPrompt);
      await addChallenge(challenge);
      setCurrentPrompt('');
    } catch (err) {
      setError('Failed to generate challenge. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async () => {
    if (currentChallenge) {
      await markChallengeComplete(currentChallenge.id);
    }
  };

  const handlePremiumPress = () => {
    router.push('/premium');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Daily Challenge</Text>
          <StreakIndicator streak={user.streak} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>What would you like to improve today?</Text>
          <TextInput
            style={styles.input}
            value={currentPrompt}
            onChangeText={setCurrentPrompt}
            placeholder="e.g., public speaking, meditation, coding..."
            placeholderTextColor={colors.textSecondary}
            multiline={false}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[
              styles.generateButton,
              (!currentPrompt.trim() || isLoading) && styles.disabledButton
            ]}
            onPress={handleGenerateChallenge}
            disabled={!currentPrompt.trim() || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Sparkles size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Generate Challenge</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {currentChallenge ? (
          <ChallengeCard 
            challenge={currentChallenge} 
            onComplete={handleCompleteChallenge} 
          />
        ) : (
          <EmptyState message="Generate your first challenge to start improving today!" />
        )}

        {!user.isPremium && (
          <PremiumBanner onPress={handlePremiumPress} />
        )}

        <View style={styles.remainingContainer}>
          <Text style={styles.remainingText}>
            {user.isPremium 
              ? 'Premium: Unlimited challenges' 
              : `Free tier: ${user.challengesRemaining} challenge${user.challengesRemaining !== 1 ? 's' : ''} remaining today`}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  inputContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  remainingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});