import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface StreakIndicatorProps {
  streak: number;
}

export const StreakIndicator = ({ streak }: StreakIndicatorProps) => {
  return (
    <View style={styles.container}>
      <Flame size={20} color={streak > 0 ? colors.secondary : colors.textSecondary} />
      <Text style={[
        styles.streakText,
        { color: streak > 0 ? colors.text : colors.textSecondary }
      ]}>
        {streak} day{streak !== 1 ? 's' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});