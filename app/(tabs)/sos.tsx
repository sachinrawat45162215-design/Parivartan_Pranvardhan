import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Alert,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { getEmergencyContacts, deleteEmergencyContact, type EmergencyContact } from "@/lib/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function EmergencyContactCard({
  contact,
  onDelete,
}: {
  contact: EmergencyContact;
  onDelete: () => void;
}) {
  const handleCall = () => {
    const phoneUrl = `tel:${contact.phone}`;
    Linking.canOpenURL(phoneUrl).then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Cannot make call", "Phone calling is not supported on this device.");
      }
    });
  };

  return (
    <View style={styles.contactCard}>
      <View style={styles.contactAvatar}>
        <Ionicons name="person" size={20} color={Colors.primary} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactRelation}>{contact.relation}</Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
      </View>
      <View style={styles.contactActions}>
        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [
            styles.callButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="call" size={18} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => {
            Alert.alert("Remove Contact", `Remove ${contact.name}?`, [
              { text: "Cancel", style: "cancel" },
              { text: "Remove", style: "destructive", onPress: onDelete },
            ]);
          }}
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="trash-2" size={16} color={Colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

export default function SOSScreen() {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const pulseScale = useSharedValue(1);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const loadContacts = useCallback(() => {
    getEmergencyContacts().then(setContacts);
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleSOS = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const phoneUrl = "tel:108";
    Linking.canOpenURL(phoneUrl).then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          "Emergency - Call 108",
          "Dial 108 for ambulance service. This is a free service available 24/7.",
          [{ text: "OK" }]
        );
      }
    });
  };

  const handleDeleteContact = async (id: string) => {
    await deleteEmergencyContact(id);
    loadContacts();
  };

  const emergencyNumbers = [
    { name: "Ambulance", number: "108", icon: "ambulance" as const, color: Colors.danger },
    { name: "Health Helpline", number: "104", icon: "phone-in-talk" as const, color: Colors.primary },
    { name: "Women Helpline", number: "181", icon: "shield-account" as const, color: "#EC4899" },
    { name: "Police", number: "100", icon: "police-badge" as const, color: "#3B82F6" },
  ];

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
      <Text style={styles.headerTitle}>Emergency</Text>
      <Text style={styles.headerSubtitle}>
        Quick access to emergency services
      </Text>

      <View style={styles.sosSection}>
        <Animated.View style={[styles.sosOuterRing, pulseStyle]}>
          <Pressable
            onPress={handleSOS}
            style={({ pressed }) => [
              styles.sosButton,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
          >
            <LinearGradient
              colors={[Colors.danger, Colors.dangerDark]}
              style={styles.sosGradient}
            >
              <MaterialCommunityIcons name="phone-alert" size={40} color="#fff" />
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>Tap to call 108</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>

      <Text style={styles.sectionTitle}>Emergency Numbers</Text>
      <View style={styles.numbersGrid}>
        {emergencyNumbers.map((item) => (
          <Pressable
            key={item.number}
            onPress={() => {
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Linking.openURL(`tel:${item.number}`).catch(() => {
                Alert.alert(`Call ${item.name}`, `Dial ${item.number}`);
              });
            }}
            style={({ pressed }) => [
              styles.numberCard,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={[styles.numberIcon, { backgroundColor: item.color + "15" }]}>
              <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.numberLabel}>{item.name}</Text>
            <Text style={[styles.numberValue, { color: item.color }]}>{item.number}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.contactsHeader}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/add-contact");
          }}
          style={({ pressed }) => [
            styles.addButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="add" size={20} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyContacts}>
          <Ionicons name="people-outline" size={40} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No emergency contacts added</Text>
          <Text style={styles.emptySubtext}>
            Add family or doctor contacts for quick access during emergencies
          </Text>
        </View>
      ) : (
        <View style={styles.contactsList}>
          {contacts.map((contact) => (
            <EmergencyContactCard
              key={contact.id}
              contact={contact}
              onDelete={() => handleDeleteContact(contact.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color={Colors.primary} />
        <Text style={styles.infoText}>
          108 is India's free emergency ambulance service available 24/7. It operates in all states.
        </Text>
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
  sosSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  sosOuterRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: Colors.danger + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  sosButton: {
    width: 146,
    height: 146,
    borderRadius: 73,
    overflow: "hidden",
  },
  sosGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  sosText: {
    fontSize: 24,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
    letterSpacing: 2,
  },
  sosSubtext: {
    fontSize: 11,
    fontFamily: "Nunito_500Medium",
    color: "rgba(255,255,255,0.8)",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginBottom: 14,
  },
  numbersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  numberCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  numberIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  numberLabel: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.textSecondary,
  },
  numberValue: {
    fontSize: 22,
    fontFamily: "Nunito_800ExtraBold",
  },
  contactsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.primary + "15",
  },
  addButtonText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.primary,
  },
  emptyContacts: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: Colors.textTertiary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  contactsList: {
    gap: 10,
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
  },
  contactRelation: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
  },
  contactPhone: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.primary,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.danger + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: Colors.primary + "10",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
    lineHeight: 19,
  },
});
