import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { colors } from '@/constants/colors';
import { Award, CheckCircle, Home, BarChart } from 'lucide-react-native';

export default function TestResultsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { skillTests } = useStore();
  
  const test = skillTests.find(t => t.id === id);
  
  if (!test || !test.completed) {
    router.replace('/skill-tests');
    return null;
  }

  const handleGoHome = () => {
    router.replace('/');
  };

  const handleViewAllTests = () => {
    router.replace('/skill-tests');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Test Results',
          headerBackTitle: 'Back'
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.scoreContainer}>
            <Award size={32} color={colors.primary} />
            <Text style={styles.scoreText}>{test.score}</Text>
            <Text style={styles.scoreLabel}>points</Text>
          </View>
          
          <Text style={styles.title}>
            {test.skillArea} Assessment
          </Text>
          
          <Text style={styles.subtitle}>
            {test.score && test.score >= 80 
              ? "Great job! You're making excellent progress." 
              : test.score && test.score >= 50 
                ? "Good progress! Keep practicing to improve further." 
                : "You're on your way! Regular practice will help you improve."}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Responses</Text>
          
          {test.questions.map((question, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              <Text style={styles.questionText}>{question.question}</Text>
              
              {question.type === 'multiple-choice' ? (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseLabel}>Your answer:</Text>
                  <View style={styles.answerBadge}>
                    <Text style={styles.answerText}>{question.userAnswer || 'Not answered'}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseLabel}>Your response:</Text>
                  <Text style={styles.responseText}>{question.userAnswer || 'Not answered'}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.insightsCard}>
          <BarChart size={24} color={colors.primary} />
          <Text style={styles.insightsTitle}>Skill Insights</Text>
          <Text style={styles.insightsText}>
            Regular testing helps track your progress over time. Try to take a skill test every 2-4 weeks to measure your improvement.
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleGoHome}
          >
            <Home size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleViewAllTests}
          >
            <Text style={styles.secondaryButtonText}>View All Tests</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
  },
  responseContainer: {
    marginTop: 8,
  },
  responseLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  answerBadge: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  answerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  responseText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  insightsCard: {
    backgroundColor: `${colors.primary}10`,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginVertical: 8,
  },
  insightsText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 16,
  },
});