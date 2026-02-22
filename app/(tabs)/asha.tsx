import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { getPatientVisits, deletePatientVisit, type PatientVisit } from "@/lib/storage";
import { useLanguage } from "@/lib/language-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function VisitCard({
  visit,
  onDelete,
  t,
}: {
  visit: PatientVisit;
  onDelete: () => void;
  t: (key: any) => any;
}) {
  const categoryConfig: Record<
    PatientVisit["category"],
    { label: string; color: string; icon: string }
  > = {
    general: { label: t("general"), color: Colors.primary, icon: "person" },
    maternal: { label: t("maternal"), color: "#EC4899", icon: "baby-carriage" },
    chronic: { label: t("chronic"), color: Colors.accent, icon: "heart-pulse" },
    child: { label: t("child"), color: "#06B6D4", icon: "baby-face-outline" },
  };

  const config = categoryConfig[visit.category];
  const visitDate = new Date(visit.visitDate);
  const dateStr = visitDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.visitCard}>
      <View style={styles.visitCardHeader}>
        <View style={[styles.visitCategoryDot, { backgroundColor: config.color }]} />
        <Text style={[styles.visitCategoryLabel, { color: config.color }]}>
          {config.label}
        </Text>
        <Text style={styles.visitDate}>{dateStr}</Text>
        <Pressable
          onPress={() => {
            Alert.alert(t("deleteVisit"), t("areYouSure"), [
              { text: t("cancel"), style: "cancel" },
              { text: t("delete"), style: "destructive", onPress: onDelete },
            ]);
          }}
          hitSlop={8}
        >
          <Feather name="trash-2" size={14} color={Colors.textTertiary} />
        </Pressable>
      </View>
      <View style={styles.visitBody}>
        <View style={styles.visitPatientRow}>
          <Text style={styles.visitPatientName}>{visit.patientName}</Text>
          <Text style={styles.visitPatientMeta}>
            {visit.age}y, {visit.gender}
          </Text>
        </View>
        <Text style={styles.visitVillage}>{visit.village}</Text>
        {visit.symptoms ? (
          <View style={styles.visitField}>
            <Text style={styles.visitFieldLabel}>{t("symptoms")}:</Text>
            <Text style={styles.visitFieldValue} numberOfLines={2}>
              {visit.symptoms}
            </Text>
          </View>
        ) : null}
        {visit.diagnosis ? (
          <View style={styles.visitField}>
            <Text style={styles.visitFieldLabel}>{t("diagnosis")}:</Text>
            <Text style={styles.visitFieldValue} numberOfLines={1}>
              {visit.diagnosis}
            </Text>
          </View>
        ) : null}
        {visit.followUpDate ? (
          <View style={styles.followUpBadge}>
            <Ionicons name="calendar-outline" size={12} color={Colors.accent} />
            <Text style={styles.followUpText}>
              {t("followUp")}:{" "}
              {new Date(visit.followUpDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default function ASHAScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [visits, setVisits] = useState<PatientVisit[]>([]);
  const [filterCategory, setFilterCategory] = useState<PatientVisit["category"] | "all">("all");
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const loadVisits = useCallback(() => {
    getPatientVisits().then(setVisits);
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const handleDelete = async (id: string) => {
    await deletePatientVisit(id);
    loadVisits();
  };

  const filteredVisits =
    filterCategory === "all"
      ? visits
      : visits.filter((v) => v.category === filterCategory);

  const stats = {
    total: visits.length,
    maternal: visits.filter((v) => v.category === "maternal").length,
    chronic: visits.filter((v) => v.category === "chronic").length,
    followUps: visits.filter((v) => v.followUpDate).length,
  };

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
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t("ashaDashboard")}</Text>
          <Text style={styles.headerSubtitle}>{t("communityHealthWorker")}</Text>
        </View>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/add-visit");
          }}
          style={({ pressed }) => [
            styles.addVisitBtn,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCardPrimary}
        >
          <MaterialCommunityIcons name="clipboard-list" size={24} color="#fff" />
          <Text style={styles.statValueWhite}>{stats.total}</Text>
          <Text style={styles.statLabelWhite}>{t("totalVisits")}</Text>
        </LinearGradient>
        <View style={styles.statsCol}>
          <View style={styles.statCardSmall}>
            <MaterialCommunityIcons name="baby-carriage" size={18} color="#EC4899" />
            <Text style={styles.statValueSmall}>{stats.maternal}</Text>
            <Text style={styles.statLabelSmall}>{t("maternal")}</Text>
          </View>
          <View style={styles.statCardSmall}>
            <MaterialCommunityIcons name="heart-pulse" size={18} color={Colors.accent} />
            <Text style={styles.statValueSmall}>{stats.chronic}</Text>
            <Text style={styles.statLabelSmall}>{t("chronic")}</Text>
          </View>
        </View>
      </View>

      {stats.followUps > 0 && (
        <View style={styles.followUpAlert}>
          <Ionicons name="notifications" size={18} color={Colors.accent} />
          <Text style={styles.followUpAlertText}>
            {stats.followUps} {stats.followUps > 1 ? t("pendingFollowUps") : t("pendingFollowUp")}
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterContainer}
      >
        {[
          { key: "all" as const, label: t("all") },
          { key: "general" as const, label: t("general") },
          { key: "maternal" as const, label: t("maternal") },
          { key: "chronic" as const, label: t("chronic") },
          { key: "child" as const, label: t("child") },
        ].map((f) => {
          const isActive = filterCategory === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilterCategory(f.key)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>
        {t("patientVisits")} ({filteredVisits.length})
      </Text>

      {filteredVisits.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={48}
            color={Colors.textTertiary}
          />
          <Text style={styles.emptyText}>{t("noVisitsRecorded")}</Text>
          <Text style={styles.emptySubtext}>{t("tapToLogVisit")}</Text>
        </View>
      ) : (
        <View style={styles.visitsList}>
          {filteredVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onDelete={() => handleDelete(visit.id)}
              t={t}
            />
          ))}
        </View>
      )}
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
  headerTitle: {
    fontSize: 26,
    fontFamily: "Nunito_800ExtraBold",
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addVisitBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCardPrimary: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
    gap: 6,
  },
  statValueWhite: {
    fontSize: 32,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
  },
  statLabelWhite: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(255,255,255,0.85)",
  },
  statsCol: {
    flex: 1,
    gap: 12,
  },
  statCardSmall: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  statValueSmall: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    color: Colors.text,
  },
  statLabelSmall: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
  },
  followUpAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.accent + "12",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  followUpAlertText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.accent,
  },
  filterContainer: {
    maxHeight: 44,
    marginBottom: 16,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginBottom: 14,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: Colors.textTertiary,
  },
  visitsList: {
    gap: 12,
  },
  visitCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  visitCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceSecondary,
  },
  visitCategoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  visitCategoryLabel: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    flex: 1,
  },
  visitDate: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
    marginRight: 8,
  },
  visitBody: {
    padding: 14,
    gap: 6,
  },
  visitPatientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  visitPatientName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
  },
  visitPatientMeta: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
  },
  visitVillage: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
  },
  visitField: {
    marginTop: 4,
  },
  visitFieldLabel: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    color: Colors.textSecondary,
  },
  visitFieldValue: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: Colors.text,
    lineHeight: 18,
  },
  followUpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.accent + "12",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  followUpText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.accent,
  },
});
