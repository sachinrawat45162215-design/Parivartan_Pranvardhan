import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  symptomAreas,
  analyzeSymptoms,
  type Symptom,
  type SymptomArea,
  type SymptomResult,
} from "@/lib/health-data";

type Step = "area" | "symptoms" | "result";

function AreaCard({
  area,
  onSelect,
}: {
  area: SymptomArea;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect();
      }}
      style={({ pressed }) => [
        styles.areaCard,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <View style={styles.areaIconWrap}>
        <MaterialCommunityIcons
          name={area.iconName as any}
          size={28}
          color={Colors.primary}
        />
      </View>
      <Text style={styles.areaName}>{area.name}</Text>
      <Text style={styles.areaCount}>{area.symptoms.length} symptoms</Text>
      <Feather name="chevron-right" size={18} color={Colors.textTertiary} />
    </Pressable>
  );
}

function SymptomCheckbox({
  symptom,
  isSelected,
  onToggle,
}: {
  symptom: Symptom;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const severityColor =
    symptom.severity === "severe"
      ? Colors.danger
      : symptom.severity === "moderate"
      ? Colors.warning
      : Colors.success;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.selectionAsync();
        onToggle();
      }}
      style={({ pressed }) => [
        styles.symptomItem,
        isSelected && styles.symptomItemSelected,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          isSelected && { backgroundColor: Colors.primary, borderColor: Colors.primary },
        ]}
      >
        {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <Text
        style={[
          styles.symptomName,
          isSelected && styles.symptomNameSelected,
        ]}
      >
        {symptom.name}
      </Text>
      <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
    </Pressable>
  );
}

function ResultView({ result, onReset }: { result: SymptomResult; onReset: () => void }) {
  const severityConfig = {
    low: { color: Colors.success, bg: "#DCFCE7", icon: "checkmark-circle" as const, label: "Low Risk" },
    medium: { color: Colors.warning, bg: "#FEF3C7", icon: "alert-circle" as const, label: "Medium Risk" },
    high: { color: Colors.danger, bg: "#FEE2E2", icon: "warning" as const, label: "High Risk" },
  };
  const config = severityConfig[result.severity];

  return (
    <ScrollView
      contentContainerStyle={styles.resultContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.resultBanner, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={36} color={config.color} />
        <Text style={[styles.resultSeverity, { color: config.color }]}>
          {config.label}
        </Text>
      </View>

      <Text style={styles.resultCondition}>{result.condition}</Text>
      <Text style={styles.resultDescription}>{result.description}</Text>

      <Text style={styles.resultSectionTitle}>Recommendations</Text>
      <View style={styles.recommendations}>
        {result.recommendations.map((rec, index) => (
          <View key={index} style={styles.recItem}>
            <View style={styles.recDot}>
              <Ionicons name="checkmark" size={12} color={Colors.primary} />
            </View>
            <Text style={styles.recText}>{rec}</Text>
          </View>
        ))}
      </View>

      {result.seekDoctor && (
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.doctorCard}
        >
          <MaterialCommunityIcons name="doctor" size={24} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.doctorCardTitle}>Visit a Doctor</Text>
            <Text style={styles.doctorCardDesc}>
              Based on your symptoms, please consult a healthcare professional soon.
            </Text>
          </View>
        </LinearGradient>
      )}

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={16} color={Colors.textTertiary} />
        <Text style={styles.disclaimerText}>
          This is a basic assessment tool and not a substitute for professional medical advice. Always consult a doctor for accurate diagnosis.
        </Text>
      </View>

      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onReset();
        }}
        style={({ pressed }) => [
          styles.resetButton,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Feather name="refresh-cw" size={16} color={Colors.primary} />
        <Text style={styles.resetButtonText}>Check Again</Text>
      </Pressable>
    </ScrollView>
  );
}

export default function SymptomCheckerScreen() {
  const [step, setStep] = useState<Step>("area");
  const [selectedArea, setSelectedArea] = useState<SymptomArea | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [result, setResult] = useState<SymptomResult | null>(null);

  const handleAreaSelect = (area: SymptomArea) => {
    setSelectedArea(area);
    setStep("symptoms");
  };

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.id === symptom.id);
      if (exists) return prev.filter((s) => s.id !== symptom.id);
      return [...prev, symptom];
    });
  };

  const handleAnalyze = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const analysisResult = analyzeSymptoms(selectedSymptoms);
    setResult(analysisResult);
    setStep("result");
  };

  const handleReset = () => {
    setStep("area");
    setSelectedArea(null);
    setSelectedSymptoms([]);
    setResult(null);
  };

  if (step === "result" && result) {
    return (
      <View style={styles.container}>
        <ResultView result={result} onReset={handleReset} />
      </View>
    );
  }

  if (step === "symptoms" && selectedArea) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => setStep("area")} style={styles.backRow}>
            <Feather name="arrow-left" size={18} color={Colors.primary} />
            <Text style={styles.backText}>Change Body Area</Text>
          </Pressable>

          <View style={styles.selectedAreaHeader}>
            <MaterialCommunityIcons
              name={selectedArea.iconName as any}
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.selectedAreaName}>{selectedArea.name}</Text>
          </View>

          <Text style={styles.instructionText}>
            Select the symptoms you are experiencing:
          </Text>

          <View style={styles.symptomsList}>
            {selectedArea.symptoms.map((symptom) => (
              <SymptomCheckbox
                key={symptom.id}
                symptom={symptom}
                isSelected={selectedSymptoms.some((s) => s.id === symptom.id)}
                onToggle={() => toggleSymptom(symptom)}
              />
            ))}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.severityDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>Mild</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.severityDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.legendText}>Moderate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.severityDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.legendText}>Severe</Text>
            </View>
          </View>

          <Pressable
            onPress={handleAnalyze}
            disabled={selectedSymptoms.length === 0}
            style={({ pressed }) => [
              styles.analyzeButton,
              selectedSymptoms.length === 0 && styles.analyzeButtonDisabled,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.analyzeButtonText}>
              Analyze {selectedSymptoms.length > 0 ? `(${selectedSymptoms.length})` : ""}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instructionText}>
          Select the body area where you feel discomfort:
        </Text>

        <View style={styles.areasList}>
          {symptomAreas.map((area) => (
            <AreaCard key={area.id} area={area} onSelect={() => handleAreaSelect(area)} />
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={16} color={Colors.textTertiary} />
          <Text style={styles.disclaimerText}>
            This tool provides basic health guidance. It is not a replacement for professional medical consultation.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  resultContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  areasList: {
    gap: 10,
  },
  areaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  areaIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  areaName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
  },
  areaCount: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.primary,
  },
  selectedAreaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  selectedAreaName: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
  },
  symptomsList: {
    gap: 8,
    marginBottom: 20,
  },
  symptomItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  symptomItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "08",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  symptomName: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.text,
  },
  symptomNameSelected: {
    color: Colors.primary,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  resultBanner: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  resultSeverity: {
    fontSize: 18,
    fontFamily: "Nunito_800ExtraBold",
  },
  resultCondition: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginBottom: 12,
  },
  recommendations: {
    gap: 10,
    marginBottom: 24,
  },
  recItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  recDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  recText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Nunito_500Medium",
    color: Colors.text,
    lineHeight: 20,
  },
  doctorCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  doctorCardTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  doctorCardDesc: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
    marginTop: 2,
  },
  disclaimer: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.textTertiary,
    lineHeight: 17,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: Colors.primary,
  },
});
