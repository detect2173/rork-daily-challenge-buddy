import React from "react";
import { Tabs, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { TouchableOpacity, Image } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleProfilePress = () => {
    router.push("/profile");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "600",
        },
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={handleProfilePress}
          >
            <Image
              source={
                user?.photoURL
                  ? { uri: user.photoURL }
                  : {
                      uri: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop",
                    }
              }
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Daily Challenge",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="check-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="skill-tests"
        options={{
          title: "Skill Tests",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="star-rate" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
