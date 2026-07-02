import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

import Loader from "../Loader/Loader";
import { apiFetch } from "../../apiFetch";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { palette } = colors;

// ---------------------------------------------------------------------------
// Single FAQ card — smoothly expands/collapses by animating its measured height.
// ---------------------------------------------------------------------------
const FAQItem = ({ faq, index, open, onToggle }) => {
  const [contentHeight, setContentHeight] = useState(0);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 350, delay: index * 60 }}
      style={[styles.card, open && styles.cardOpen]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggle}
        style={styles.questionRow}
      >
        <View style={[styles.qBadge, open && styles.qBadgeOpen]}>
          <Text style={[styles.qBadgeText, open && styles.qBadgeTextOpen]}>Q</Text>
        </View>

        <Text style={styles.question}>{faq.question}</Text>

        <MotiView
          animate={{ rotate: open ? "180deg" : "0deg" }}
          transition={{ type: "timing", duration: 250 }}
          style={styles.chevron}
        >
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={open ? palette.emerald700 : colors.text.muted}
          />
        </MotiView>
      </TouchableOpacity>

      {/* Animated panel: height + opacity glide between 0 and the measured height */}
      <MotiView
        animate={{ height: open ? contentHeight : 0, opacity: open ? 1 : 0 }}
        transition={{
          height: { type: "timing", duration: 300, easing: Easing.out(Easing.cubic) },
          opacity: { type: "timing", duration: open ? 320 : 160 },
        }}
        style={styles.panel}
      >
        {/* Absolutely positioned so it reports full height regardless of panel height */}
        <View
          style={styles.measure}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.answerWrap}>
            <View style={styles.answerDivider} />
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        </View>
      </MotiView>
    </MotiView>
  );
};

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await apiFetch(`/content/faqs`);
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setErrorMsg("No FAQs available at the moment.");
      } else {
        setFaqs(data);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setErrorMsg("Unable to load FAQs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero header */}
      <LinearGradient
        colors={[palette.ink, palette.emerald900, palette.emerald800]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroBadge}>
          <MaterialIcons name="help-outline" size={24} color={palette.white} />
        </View>
        <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
        <Text style={styles.heroSubtitle}>
          Everything you need to know, answered.
        </Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centerBox}>
          <Loader />
        </View>
      ) : errorMsg ? (
        <View style={styles.errorCard}>
          <MaterialIcons
            name="info-outline"
            size={46}
            color={colors.text.muted}
            style={{ marginBottom: space.md }}
          />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              index={index}
              open={expandedIndex === index}
              onToggle={() => toggleExpand(index)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  content: { paddingBottom: space["5xl"] },

  // Hero
  hero: {
    paddingTop: space["3xl"],
    paddingBottom: space["3xl"],
    paddingHorizontal: space.xl,
    alignItems: "center",
    borderBottomLeftRadius: radius["2xl"],
    borderBottomRightRadius: radius["2xl"],
  },
  heroBadge: {
    width: 56, height: 56, borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center", marginBottom: space.md,
  },
  heroTitle: {
    ...typography.h2, color: palette.white, textAlign: "center", letterSpacing: 0.3,
  },
  heroSubtitle: {
    ...typography.body, color: palette.emerald100, opacity: 0.85,
    textAlign: "center", marginTop: space.xs,
  },

  // States
  centerBox: { paddingVertical: space["6xl"], alignItems: "center", justifyContent: "center" },
  errorCard: {
    margin: space.lg, padding: space.xl, marginTop: space["3xl"],
    backgroundColor: colors.bg.surface, borderRadius: radius.lg, alignItems: "center", ...shadows.e1,
  },
  errorText: { ...typography.bodyLg, color: colors.text.muted, textAlign: "center", lineHeight: 22 },

  // List
  list: { padding: space.lg },
  card: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    marginBottom: space.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.e1,
  },
  cardOpen: {
    borderColor: colors.brand.primaryLight,
    ...shadows.e3,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: space.lg,
  },
  qBadge: {
    width: 30, height: 30, borderRadius: radius.sm,
    backgroundColor: colors.bg.sunken,
    alignItems: "center", justifyContent: "center", marginRight: space.md,
  },
  qBadgeOpen: { backgroundColor: colors.brand.tint },
  qBadgeText: { ...typography.label, color: colors.text.muted, fontWeight: "800" },
  qBadgeTextOpen: { color: colors.brand.primaryDark },
  question: {
    ...typography.bodyLg, flex: 1, color: colors.text.primary,
    fontWeight: "700", marginRight: space.sm,
  },
  chevron: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },

  // Animated answer panel
  panel: { overflow: "hidden" },
  measure: { position: "absolute", left: 0, right: 0, top: 0 },
  answerWrap: {
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
    paddingLeft: space.lg + 30 + space.md, // align under the question text
  },
  answerDivider: {
    height: 1, backgroundColor: colors.border.subtle, marginBottom: space.md,
  },
  answer: { ...typography.body, color: colors.text.secondary, lineHeight: 22 },
});

export default FAQ;
