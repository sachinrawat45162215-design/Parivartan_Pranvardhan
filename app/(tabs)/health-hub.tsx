import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  healthArticles,
  categoryColors,
  type HealthArticle,
} from "@/lib/health-data";
import { getSavedArticles } from "@/lib/storage";
import { useLanguage } from "@/lib/language-context";

type CategoryFilter = HealthArticle["category"] | "all";

function ArticleCard({ article, isSaved, t }: { article: HealthArticle; isSaved: boolean; t: (key: any) => any }) {
  const catColor = categoryColors[article.category];
  const categoryLabelMap: Record<string, string> = {
    hygiene: t("categoryHygiene"),
    nutrition: t("categoryNutrition"),
    maternal: t("categoryMaternal"),
    vaccination: t("categoryVaccination"),
    chronic: t("categoryChronic"),
    child: t("categoryChild"),
  };

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/article/[id]", params: { id: article.id } });
      }}
      style={({ pressed }) => [
        styles.articleCard,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View style={[styles.articleIconWrap, { backgroundColor: catColor + "18" }]}>
        {article.iconSet === "MaterialCommunityIcons" ? (
          <MaterialCommunityIcons name={article.iconName as any} size={24} color={catColor} />
        ) : (
          <Ionicons name={article.iconName as any} size={24} color={catColor} />
        )}
      </View>
      <View style={styles.articleContent}>
        <View style={styles.articleMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + "15" }]}>
            <Text style={[styles.categoryBadgeText, { color: catColor }]}>
              {categoryLabelMap[article.category]}
            </Text>
          </View>
          <Text style={styles.readTime}>{article.readTime} {t("minRead")}</Text>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.articleSummary} numberOfLines={2}>{article.summary}</Text>
      </View>
      {isSaved && (
        <Ionicons name="bookmark" size={16} color={Colors.primary} style={styles.savedIcon} />
      )}
    </Pressable>
  );
}

export default function HealthHubScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  useEffect(() => {
    getSavedArticles().then(setSavedIds);
  }, []);

  const categories: { key: CategoryFilter; label: string; icon: string }[] = [
    { key: "all", label: t("all"), icon: "apps" },
    { key: "hygiene", label: t("hygiene"), icon: "water-outline" },
    { key: "nutrition", label: t("nutrition"), icon: "nutrition-outline" },
    { key: "maternal", label: t("maternal"), icon: "heart-outline" },
    { key: "vaccination", label: t("vaccines"), icon: "shield-checkmark-outline" },
    { key: "chronic", label: t("chronic"), icon: "fitness-outline" },
    { key: "child", label: t("child"), icon: "happy-outline" },
  ];

  const filteredArticles =
    activeCategory === "all"
      ? healthArticles
      : healthArticles.filter((a) => a.category === activeCategory);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Text style={styles.headerTitle}>{t("healthAwareness")}</Text>
        <Text style={styles.headerSubtitle}>
          {filteredArticles.length} {t("articlesAvailable")}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryContainer}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <Pressable
              key={cat.key}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                setActiveCategory(cat.key);
              }}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive,
              ]}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={isActive ? "#fff" : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleCard article={item} isSaved={savedIds.includes(item.id)} t={t} />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === "web" ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filteredArticles.length > 0}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>{t("noArticlesCategory")}</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.background,
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
  categoryContainer: {
    maxHeight: 48,
    backgroundColor: Colors.background,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: "center",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  articleCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 14,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  articleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  articleContent: {
    flex: 1,
    gap: 6,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
  },
  readTime: {
    fontSize: 11,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
  },
  articleTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    lineHeight: 20,
  },
  articleSummary: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  savedIcon: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
  },
});
