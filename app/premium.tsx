import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { Check, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function PremiumScreen() {
  const router = useRouter();
  const { user: appUser, updateUser } = useStore();
  const { user: authUser } = useAuthStore();

  const handleSubscribe = () => {
    // In a real app, this would handle the subscription process through in-app purchases
    Alert.alert(
      'Confirm Subscription',
      'Would you like to subscribe to Premium for $4.99/month?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Subscribe', 
          onPress: async () => {
            try {
              // Update local state
              await updateUser({ isPremium: true });
              
              Alert.alert(
                'Subscription Successful',
                'You now have access to all premium features!',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (error) {
              console.error('Error updating subscription:', error);
              Alert.alert('Error', 'Failed to process subscription. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <X size={24} color={colors.text} />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>Unlock your full potential</Text>
        
        {authUser && (
          <Text style={styles.welcomeText}>
            Welcome, {authUser.displayName || 'User'}!
          </Text>
        )}
        
        <View style={styles.pricingContainer}>
          <Text style={styles.price}>$4.99</Text>
          <Text style={styles.period}>per month</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Unlimited daily challenges</Text>
          </View>
          <View style={styles.featureRow}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Access to challenge history</Text>
          </View>
          <View style={styles.featureRow}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Detailed progress tracking</Text>
          </View>
          <View style={styles.featureRow}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Skill assessment tests</Text>
          </View>
          <View style={styles.featureRow}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Personalized recommendations</Text>
          </View>
          <View style={styles.featureRow}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Ad-free experience</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.subscribeButton, appUser.isPremium && styles.disabledButton]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
          disabled={appUser.isPremium}
        >
          <Text style={styles.buttonText}>
            {appUser.isPremium ? 'Already Subscribed' : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period. You can manage your subscription in your account settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  content: {
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 24,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  period: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});