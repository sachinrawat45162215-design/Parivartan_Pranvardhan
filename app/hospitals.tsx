import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Pressable,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  cityWiseHospitals,
  hospitalTypeConfig,
  type Hospital,
  type CityHospitals,
} from "@/lib/hospital-data";
import { useLanguage } from "@/lib/language-context";

type TypeFilter = Hospital["type"] | "all";

function HospitalCard({
  hospital,
  lang,
  t,
}: {
  hospital: Hospital;
  lang: string;
  t: (key: any) => any;
}) {
  const config = hospitalTypeConfig[hospital.type];
  const name = lang === "hi" ? hospital.nameHi : hospital.name;
  const address = lang === "hi" ? hospital.addressHi : hospital.address;
  const typeLabel = lang === "hi" ? config.labelHi : config.labelEn;

  const handleCall = () => {
    const phoneUrl = `tel:${hospital.phone}`;
    Linking.canOpenURL(phoneUrl).then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert(hospital.name, hospital.phone);
      }
    });
  };

  const handleOpenMap = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${hospital.latitude},${hospital.longitude}`,
      android: `geo:${hospital.latitude},${hospital.longitude}?q=${hospital.latitude},${hospital.longitude}(${encodeURIComponent(hospital.name)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`,
    });
    if (url) {
      Linking.openURL(url).catch(() => {
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`
        );
      });
    }
  };

  return (
    <View style={styles.hospitalCard}>
      <View style={styles.hospitalHeader}>
        <View style={[styles.hospitalIconWrap, { backgroundColor: config.color + "15" }]}>
          <MaterialCommunityIcons name={config.icon as any} size={22} color={config.color} />
        </View>
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName} numberOfLines={2}>{name}</Text>
          <View style={[styles.typeBadge, { backgroundColor: config.color + "12" }]}>
            <Text style={[styles.typeBadgeText, { color: config.color }]}>{typeLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.hospitalDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.detailText} numberOfLines={2}>{address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{hospital.phone}</Text>
        </View>
      </View>

      <View style={styles.hospitalActions}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleCall();
          }}
          style={({ pressed }) => [styles.actionBtn, styles.callBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.actionBtnTextWhite}>{t("callNow")}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleOpenMap();
          }}
          style={({ pressed }) => [styles.actionBtn, styles.mapBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
          <Text style={styles.actionBtnTextPrimary}>{t("viewOnMap")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HospitalsScreen() {
  const { lang, t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredData = cityWiseHospitals
    .map((city) => ({
      ...city,
      hospitals:
        typeFilter === "all"
          ? city.hospitals
          : city.hospitals.filter((h) => h.type === typeFilter),
    }))
    .filter((city) => city.hospitals.length > 0);

  const sections = filteredData.map((city) => ({
    title: lang === "hi" ? `${city.cityHi}, ${city.stateHi}` : `${city.city}, ${city.state}`,
    data: city.hospitals,
    count: city.hospitals.length,
  }));

  const totalHospitals = sections.reduce((sum, s) => sum + s.count, 0);

  const filterOptions: { key: TypeFilter; label: string }[] = [
    { key: "all", label: t("all") },
    { key: "government", label: t("governmentType") },
    { key: "private", label: t("privateType") },
    { key: "phc", label: t("phcType") },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {filterOptions.map((f) => {
          const isActive = typeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                setTypeFilter(f.key);
              }}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.resultCount}>
        {totalHospitals} {t("hospitalsIn")} {sections.length} {t("cities")}
      </Text>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HospitalCard hospital={item} lang={lang} t={t} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
            <View style={styles.sectionCountBadge}>
              <Text style={styles.sectionCountText}>{section.count}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="hospital-building" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>{t("noHospitalsFound")}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: Colors.background,
  },
  filterChip: {
    paddingHorizontal: 14,
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
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#fff",
  },
  resultCount: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: Colors.background,
  },
  sectionHeaderText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
  },
  sectionCountBadge: {
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  sectionCountText: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    color: Colors.primary,
  },
  hospitalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  hospitalHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  hospitalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  hospitalInfo: {
    flex: 1,
    gap: 6,
  },
  hospitalName: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    lineHeight: 20,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
  },
  hospitalDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  hospitalActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  callBtn: {
    backgroundColor: Colors.success,
  },
  mapBtn: {
    backgroundColor: Colors.primary + "12",
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  actionBtnTextWhite: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
  },
  actionBtnTextPrimary: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
  },
});
