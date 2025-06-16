import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { SkillTestCard } from "@/components/SkillTestCard";
import { EmptyState } from "@/components/EmptyState";
import { PremiumBanner } from "@/components/PremiumBanner";
import { colors } from "@/constants/colors";

export default function SkillTestsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [skillArea, setSkillArea] = useState("");

  const { skillTests, user, isLoading, error, createSkillTest } = useStore();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
  }, [isAuthenticated]);

  const handlePremiumPress = () => {
    router.push("/premium");
  };

  const handleCreateTest = async () => {
    if (!skillArea.trim()) {
      Alert.alert("Please enter a skill area");
      return;
    }

    await createSkillTest(skillArea);
    setSkillArea("");
    setShowCreateForm(false);
  };

  if (!user.isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockIconContainer}>
            <Lock size={32} color={colors.primary} />
          </View>
          <Text style={styles.lockedTitle}>Test Your Skills</Text>
          <Text style={styles.lockedDescription}>
            Upgrade to premium to access skill tests that help you measure your
            progress and identify areas for improvement.
          </Text>
          <PremiumBanner onPress={handlePremiumPress} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Skill Tests</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.formLabel}>
            What skill would you like to test?
          </Text>
          <TextInput
            style={styles.input}
            value={skillArea}
            onChangeText={setSkillArea}
            placeholder="e.g., public speaking, meditation, coding..."
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity
            style={[
              styles.createTestButton,
              (!skillArea.trim() || isLoading) && styles.disabledButton,
            ]}
            onPress={handleCreateTest}
            disabled={!skillArea.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Create Skill Test</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.infoCard}>
        <Award size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Skill tests help you measure your progress and identify areas for
          improvement. Take tests periodically to track your growth.
        </Text>
      </View>

      {skillTests.length > 0 ? (
        skillTests.map((test) => <SkillTestCard key={test.id} test={test} />)
      ) : (
        <EmptyState message="You haven't created any skill tests yet. Create your first test to start tracking your progress!" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  createButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  createForm: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  createTestButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: `${colors.primary}10`,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
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
