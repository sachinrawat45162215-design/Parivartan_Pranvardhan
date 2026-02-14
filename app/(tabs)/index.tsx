import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const healthTips = [
  "Wash hands with soap for 20 seconds before eating and after using the toilet.",
  "Drink at least 8 glasses of clean water daily to stay hydrated.",
  "Walk for 30 minutes every day to keep your heart healthy.",
  "Eat seasonal fruits and vegetables for better nutrition.",
  "Get your children vaccinated on time at the nearest health center.",
  "Sleep 7-8 hours every night for better health and immunity.",
  "Use mosquito nets to protect from malaria and dengue.",
  "Exclusive breastfeeding for 6 months gives the best start to babies.",
];

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  onPress: () => void;
}

function QuickAction({ icon, label, color, bgColor, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.quickAction,
        { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconCircle, { backgroundColor: color + "18" }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [tipIndex, setTipIndex] = useState(0);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * healthTips.length);
    setTipIndex(randomIndex);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + webTopInset + 16,
          paddingBottom: Platform.OS === "web" ? 34 + 84 : 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Namaste</Text>
          <Text style={styles.subtitle}>Your health companion</Text>
        </View>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="heart-pulse" size={24} color={Colors.primary} />
        </View>
      </View>

      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tipCard}
      >
        <View style={styles.tipHeader}>
          <Ionicons name="bulb" size={20} color="#FCD34D" />
          <Text style={styles.tipLabel}>Daily Health Tip</Text>
        </View>
        <Text style={styles.tipText}>{healthTips[tipIndex]}</Text>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTipIndex((prev) => (prev + 1) % healthTips.length);
          }}
          style={({ pressed }) => [
            styles.tipButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="refresh-cw" size={14} color="#fff" />
          <Text style={styles.tipButtonText}>Next Tip</Text>
        </Pressable>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickActions}>
        <QuickAction
          icon={<MaterialCommunityIcons name="stethoscope" size={26} color={Colors.primary} />}
          label="Check Symptoms"
          color={Colors.primary}
          bgColor={Colors.primary + "15"}
          onPress={() => router.push("/symptom-checker")}
        />
        <QuickAction
          icon={<MaterialCommunityIcons name="alarm-light" size={26} color={Colors.danger} />}
          label="Emergency SOS"
          color={Colors.danger}
          bgColor={Colors.danger + "15"}
          onPress={() => router.push("/(tabs)/sos")}
        />
        <QuickAction
          icon={<Ionicons name="book" size={26} color="#8B5CF6" />}
          label="Health Hub"
          color="#8B5CF6"
          bgColor="#8B5CF615"
          onPress={() => router.push("/(tabs)/health-hub")}
        />
        <QuickAction
          icon={<MaterialCommunityIcons name="account-heart" size={26} color={Colors.accent} />}
          label="ASHA Panel"
          color={Colors.accent}
          bgColor={Colors.accent + "15"}
          onPress={() => router.push("/(tabs)/asha")}
        />
      </View>

      <Text style={styles.sectionTitle}>Health Services</Text>
      <View style={styles.serviceCards}>
        <Pressable
          onPress={() => router.push("/(tabs)/health-hub")}
          style={({ pressed }) => [
            styles.serviceCard,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <LinearGradient
            colors={["#ECFDF5", "#D1FAE5"]}
            style={styles.serviceGradient}
          >
            <MaterialCommunityIcons name="baby-carriage" size={32} color="#059669" />
            <Text style={styles.serviceCardTitle}>Maternal Care</Text>
            <Text style={styles.serviceCardDesc}>Prenatal, delivery & postnatal guides</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/health-hub")}
          style={({ pressed }) => [
            styles.serviceCard,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <LinearGradient
            colors={["#EFF6FF", "#DBEAFE"]}
            style={styles.serviceGradient}
          >
            <Ionicons name="shield-checkmark" size={32} color="#2563EB" />
            <Text style={styles.serviceCardTitle}>Vaccination</Text>
            <Text style={styles.serviceCardDesc}>Child immunization schedule & info</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push("/(tabs)/health-hub")}
        style={({ pressed }) => [
          styles.govSchemeCard,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={styles.govSchemeIconWrap}>
          <Ionicons name="megaphone" size={24} color="#7C3AED" />
        </View>
        <View style={styles.govSchemeContent}>
          <Text style={styles.govSchemeTitle}>Government Health Schemes</Text>
          <Text style={styles.govSchemeDesc}>
            Learn about Ayushman Bharat, JSY, JSSK and more free healthcare benefits
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={Colors.textTertiary} />
      </Pressable>

      <Text style={styles.sectionTitle}>Quick Stats</Text>
      <View style={styles.statsRow}>
        <StatCard
          icon={<Ionicons name="call" size={18} color={Colors.danger} />}
          value="108"
          label="Ambulance"
          color={Colors.danger}
        />
        <StatCard
          icon={<MaterialCommunityIcons name="hospital-building" size={18} color={Colors.primary} />}
          value="104"
          label="Health Helpline"
          color={Colors.primary}
        />
        <StatCard
          icon={<Ionicons name="woman" size={18} color="#EC4899" />}
          value="1098"
          label="Child Helpline"
          color="#EC4899"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  tipCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  tipLabel: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "rgba(255,255,255,0.9)",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
    lineHeight: 24,
    marginBottom: 14,
  },
  tipButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tipButtonText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginBottom: 14,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  quickAction: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionLabel: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.text,
    textAlign: "center",
  },
  serviceCards: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  serviceGradient: {
    padding: 16,
    gap: 8,
    minHeight: 130,
  },
  serviceCardTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginTop: 4,
  },
  serviceCardDesc: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  govSchemeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 28,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  govSchemeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#7C3AED15",
    justifyContent: "center",
    alignItems: "center",
  },
  govSchemeContent: {
    flex: 1,
  },
  govSchemeTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
  },
  govSchemeDesc: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Nunito_800ExtraBold",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
