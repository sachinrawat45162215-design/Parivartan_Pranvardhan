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
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { saveEmergencyContact } from "@/lib/storage";

export default function AddContactScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid = name.trim().length > 0 && phone.trim().length >= 10 && relation.trim().length > 0;

  const handleSave = async () => {
    if (!isValid) return;
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(true);
    try {
      await saveEmergencyContact({
        name: name.trim(),
        phone: phone.trim(),
        relation: relation.trim(),
      });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save contact. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const relations = ["Family", "Doctor", "Neighbor", "ASHA Worker", "Friend", "Other"];

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
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Dr. Sharma"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g., 9876543210"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Relationship</Text>
          <View style={styles.relationChips}>
            {relations.map((rel) => {
              const isActive = relation === rel;
              return (
                <Pressable
                  key={rel}
                  onPress={() => {
                    if (Platform.OS !== "web") Haptics.selectionAsync();
                    setRelation(rel);
                  }}
                  style={[
                    styles.relationChip,
                    isActive && styles.relationChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.relationChipText,
                      isActive && styles.relationChipTextActive,
                    ]}
                  >
                    {rel}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

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
            {saving ? "Saving..." : "Save Contact"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: Colors.text,
  },
  relationChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  relationChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  relationChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  relationChipText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.textSecondary,
  },
  relationChipTextActive: {
    color: "#fff",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 12,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
});
