import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Challenge } from '@/types/challenge';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: () => void;
}

export const ChallengeCard = ({ challenge, onComplete }: ChallengeCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.lessonTitle}>Today's Insight</Text>
        <Text style={styles.lessonText}>{challenge.lesson}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.challengeTitle}>Your Challenge</Text>
        <Text style={styles.challengeText}>{challenge.challenge}</Text>
        
        {!challenge.completed ? (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Mark as Done</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBadge}>
            <Check size={16} color="#FFFFFF" />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  content: {
    padding: 20,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  lessonText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  challengeText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 24,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  completedBadge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  completedText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});