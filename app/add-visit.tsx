import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { savePatientVisit, type PatientVisit } from "@/lib/storage";
import { useLanguage } from "@/lib/language-context";

type Category = PatientVisit["category"];

export default function AddVisitScreen() {
  const { t } = useLanguage();
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [village, setVillage] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [hasFollowUp, setHasFollowUp] = useState(false);
  const [saving, setSaving] = useState(false);

  const categoryOptions: { key: Category; label: string; icon: string; color: string }[] = [
    { key: "general", label: t("general"), icon: "person", color: Colors.primary },
    { key: "maternal", label: t("maternal"), icon: "baby-carriage", color: "#EC4899" },
    { key: "chronic", label: t("chronic"), icon: "heart-pulse", color: Colors.accent },
    { key: "child", label: t("child"), icon: "baby-face-outline", color: "#06B6D4" },
  ];

  const genderOptions = [
    { key: "male", label: t("male") },
    { key: "female", label: t("female") },
    { key: "other", label: t("other") },
  ];

  const isValid =
    patientName.trim().length > 0 &&
    age.trim().length > 0 &&
    gender.length > 0 &&
    village.trim().length > 0;

  const handleSave = async () => {
    if (!isValid) return;
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(true);
    try {
      const followUpDate = hasFollowUp
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

      await savePatientVisit({
        patientName: patientName.trim(),
        age: parseInt(age) || 0,
        gender,
        village: village.trim(),
        visitDate: new Date().toISOString(),
        symptoms: symptoms.trim(),
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim(),
        followUpDate,
        category,
      });
      router.back();
    } catch {
      Alert.alert(t("error"), t("failedToSave"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>{t("visitCategory")}</Text>
        <View style={styles.categoryRow}>
          {categoryOptions.map((opt) => {
            const isActive = category === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  if (Platform.OS !== "web") Haptics.selectionAsync();
                  setCategory(opt.key);
                }}
                style={[
                  styles.categoryChip,
                  isActive && { borderColor: opt.color, backgroundColor: opt.color + "12" },
                ]}
              >
                <MaterialCommunityIcons
                  name={opt.icon as any}
                  size={16}
                  color={isActive ? opt.color : Colors.textTertiary}
                />
                <Text style={[styles.categoryChipText, isActive && { color: opt.color }]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t("patientDetails")}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t("patientName")} *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={patientName}
              onChangeText={setPatientName}
              placeholder={t("fullName")}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>{t("age")} *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder={t("age")}
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>
          <View style={[styles.field, { flex: 2 }]}>
            <Text style={styles.label}>{t("gender")} *</Text>
            <View style={styles.genderRow}>
              {genderOptions.map((g) => {
                const isActive = gender === g.label;
                return (
                  <Pressable
                    key={g.key}
                    onPress={() => setGender(g.label)}
                    style={[styles.genderChip, isActive && styles.genderChipActive]}
                  >
                    <Text style={[styles.genderChipText, isActive && styles.genderChipTextActive]}>
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("village")} *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={village}
              onChangeText={setVillage}
              placeholder={t("village")}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>{t("clinicalDetails")}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t("symptoms")}</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder={t("symptoms") + "..."}
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("diagnosis")}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={diagnosis}
              onChangeText={setDiagnosis}
              placeholder={t("diagnosis")}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("treatmentGiven")}</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={treatment}
              onChangeText={setTreatment}
              placeholder={t("treatmentGiven") + "..."}
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.selectionAsync();
            setHasFollowUp(!hasFollowUp);
          }}
          style={styles.followUpToggle}
        >
          <View style={[styles.checkbox, hasFollowUp && styles.checkboxActive]}>
            {hasFollowUp && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.followUpText}>{t("scheduleFollowUp")}</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={!isValid || saving}
          style={({ pressed }) => [
            styles.saveButton,
            (!isValid || saving) && styles.saveButtonDisabled,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>
            {saving ? t("saving") : t("saveVisit")}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  sectionLabel: { fontSize: 16, fontFamily: "Nunito_700Bold", color: Colors.text, marginTop: 4 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  categoryChipText: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: Colors.textSecondary },
  field: { gap: 6 },
  label: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: Colors.textSecondary },
  inputWrapper: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14 },
  textAreaWrapper: { paddingTop: 4 },
  input: { paddingVertical: 12, fontSize: 15, fontFamily: "Nunito_500Medium", color: Colors.text },
  textArea: { minHeight: 70 },
  row: { flexDirection: "row", gap: 12 },
  genderRow: { flexDirection: "row", gap: 6 },
  genderChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center" },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + "12" },
  genderChipText: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: Colors.textSecondary },
  genderChipTextActive: { color: Colors.primary },
  followUpToggle: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  followUpText: { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: Colors.text },
  saveButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { fontSize: 16, fontFamily: "Nunito_700Bold", color: "#fff" },
});
