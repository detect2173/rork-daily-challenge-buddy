import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Recommendation } from '@/types/challenge';
import { useStore } from '@/store/useStore';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const { setPromptFromRecommendation } = useStore();

  const handlePress = () => {
    setPromptFromRecommendation(recommendation);
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{recommendation.title}</Text>
        <Text style={styles.description}>{recommendation.description}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.tryText}>Try this challenge</Text>
          <ArrowRight size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  tryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
});