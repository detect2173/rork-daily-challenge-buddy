import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ChallengeCard } from "@/components/ChallengeCard";
import { EmptyState } from "@/components/EmptyState";
import { PremiumBanner } from "@/components/PremiumBanner";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SkillTestCard } from "@/components/SkillTestCard";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";

export default function HistoryScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    challenges,
    user,
    markChallengeComplete,
    recommendations,
    generateRecommendations,
    skillTests,
  } = useStore();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (user.isPremium && challenges.length > 0) {
      generateRecommendations();
    }
  }, [isAuthenticated, user.isPremium, challenges.length]);

  const handleCompleteChallenge = (id: string) => {
    markChallengeComplete(id);
  };

  const handlePremiumPress = () => {
    router.push("/premium");
  };

  if (!user.isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockIconContainer}>
            <Lock size={32} color={colors.primary} />
          </View>
          <Text style={styles.lockedTitle}>Your Personal Growth Assistant</Text>
          <Text style={styles.lockedDescription}>
            Upgrade to premium to access your challenge history, get
            personalized recommendations, and track your progress over time.
          </Text>
          <PremiumBanner onPress={handlePremiumPress} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Growth Journey</Text>
      </View>

      {recommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Recommended For You</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Based on your previous challenges
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsContainer}
          >
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {skillTests.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Recent Skill Tests</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsContainer}
          >
            {skillTests.slice(0, 3).map((test) => (
              <View key={test.id} style={styles.testCardContainer}>
                <SkillTestCard test={test} />
              </View>
            ))}

            <TouchableOpacity
              style={styles.viewAllCard}
              onPress={() => router.push("/skill-tests")}
            >
              <Text style={styles.viewAllText}>View All Tests</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>Your Progress</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{challenges.length}</Text>
            <Text style={styles.statLabel}>Total Challenges</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {challenges.filter((c) => c.completed).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Challenge History</Text>
        </View>

        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onComplete={() => handleCompleteChallenge(challenge.id)}
            />
          ))
        ) : (
          <EmptyState message="You haven't completed any challenges yet. Start your journey today!" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recommendationsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  testCardContainer: {
    width: 280,
    marginRight: 12,
  },
  viewAllCard: {
    width: 120,
    height: 120,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lockedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  lockIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  lockedDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
});
