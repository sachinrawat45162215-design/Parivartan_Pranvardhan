import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  healthArticles,
  categoryLabels,
  categoryColors,
} from "@/lib/health-data";
import { getSavedArticles, toggleSavedArticle } from "@/lib/storage";

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);

  const article = healthArticles.find((a) => a.id === id);

  useEffect(() => {
    if (id) {
      getSavedArticles().then((saved) => {
        setIsSaved(saved.includes(id));
      });
    }
  }, [id]);

  const handleToggleSave = async () => {
    if (!id) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nowSaved = await toggleSavedArticle(id);
    setIsSaved(nowSaved);
  };

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={48} color={Colors.textTertiary} />
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  const catColor = categoryColors[article.category];
  const paragraphs = article.content.split("\n\n");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroIcon, { backgroundColor: catColor + "15" }]}>
        {article.iconSet === "MaterialCommunityIcons" ? (
          <MaterialCommunityIcons name={article.iconName as any} size={40} color={catColor} />
        ) : (
          <Ionicons name={article.iconName as any} size={40} color={catColor} />
        )}
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.categoryBadge, { backgroundColor: catColor + "15" }]}>
          <Text style={[styles.categoryText, { color: catColor }]}>
            {categoryLabels[article.category]}
          </Text>
        </View>
        <Text style={styles.readTime}>{article.readTime} min read</Text>
        <Pressable
          onPress={handleToggleSave}
          hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isSaved ? Colors.primary : Colors.textTertiary}
          />
        </Pressable>
      </View>

      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.summary}>{article.summary}</Text>

      <View style={styles.divider} />

      {paragraphs.map((para, index) => {
        const isHeading =
          para.endsWith(":") ||
          para.startsWith("When") ||
          para.startsWith("7 Steps") ||
          para.startsWith("Signs") ||
          para.startsWith("Symptoms") ||
          para.startsWith("Daily") ||
          para.startsWith("Boiling") ||
          para.startsWith("Chlorination") ||
          para.startsWith("Filtration") ||
          para.startsWith("Storage") ||
          para.startsWith("Budget") ||
          para.startsWith("For Children") ||
          para.startsWith("Iron-Rich") ||
          para.startsWith("Cooking") ||
          para.startsWith("Checkup") ||
          para.startsWith("Essential") ||
          para.startsWith("Danger") ||
          para.startsWith("Immunization") ||
          para.startsWith("Why Hospital") ||
          para.startsWith("What to") ||
          para.startsWith("Government") ||
          para.startsWith("After") ||
          para.startsWith("At ") ||
          para.startsWith("Prevention") ||
          para.startsWith("Remove") ||
          para.startsWith("Diet") ||
          para.startsWith("Exercise") ||
          para.startsWith("Medication") ||
          para.startsWith("Feeding") ||
          para.startsWith("Warmth") ||
          para.startsWith("Cord");

        if (para.includes("\n- ") || para.includes("\n1.")) {
          const lines = para.split("\n");
          const heading = lines[0];
          const items = lines.slice(1);

          return (
            <View key={index} style={styles.listSection}>
              <Text style={styles.listHeading}>{heading}</Text>
              {items.map((item, i) => {
                const cleaned = item.replace(/^[-\d.]+\s*/, "").trim();
                if (!cleaned) return null;
                return (
                  <View key={i} style={styles.listItem}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.listItemText}>{cleaned}</Text>
                  </View>
                );
              })}
            </View>
          );
        }

        return (
          <Text
            key={index}
            style={isHeading ? styles.sectionHeading : styles.paragraph}
          >
            {para}
          </Text>
        );
      })}
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
    paddingTop: 12,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
  },
  readTime: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: Colors.textTertiary,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "Nunito_800ExtraBold",
    color: Colors.text,
    lineHeight: 32,
    marginBottom: 10,
  },
  summary: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginBottom: 10,
    marginTop: 4,
  },
  listSection: {
    marginBottom: 16,
  },
  listHeading: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.text,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.text,
    lineHeight: 22,
  },
});
