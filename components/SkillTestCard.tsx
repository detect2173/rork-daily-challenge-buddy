import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SkillTest } from '@/types/challenge';
import { useRouter } from 'expo-router';

interface SkillTestCardProps {
  test: SkillTest;
}

export const SkillTestCard = ({ test }: SkillTestCardProps) => {
  const router = useRouter();
  
  const handlePress = () => {
    if (test.completed) {
      router.push(`/test-results/${test.id}`);
    } else {
      router.push(`/skill-test/${test.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{test.skillArea}</Text>
          {test.completed && (
            <View style={styles.completedBadge}>
              <CheckCircle size={14} color="#FFFFFF" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.date}>Created on {formatDate(test.createdAt)}</Text>
        
        <Text style={styles.description}>
          {test.completed 
            ? `You scored ${test.score}/100 on this skill assessment.`
            : `This test contains ${test.questions.length} questions to assess your progress.`}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.actionText}>
            {test.completed ? 'View Results' : 'Take Test'}
          </Text>
          <ArrowRight size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  completedBadge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
});