import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { palette } = colors;
const { width } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// STATIC CONTENT — edit these to update the About Us page (no backend needed).
// ---------------------------------------------------------------------------
const ABOUT_TEXT =
  "Basit Sanitary is a trusted name in premium bathroom and sanitary solutions. " +
  "For years we have supplied homes, builders, and contractors with high-quality " +
  "sanitary ware, fittings, and fixtures — pairing reliable products with honest " +
  "service and expert guidance for every project, big or small.";

const STATS = [
  { value: "10+", label: "Years of Trust", icon: "verified" },
  { value: "5K+", label: "Happy Customers", icon: "groups" },
  { value: "500+", label: "Premium Products", icon: "inventory-2" },
];

const MISSION =
  "To deliver premium-quality sanitary products and fittings at fair prices, backed " +
  "by genuine guidance — making every customer's space more beautiful, functional, and durable.";

const VISION =
  "To become the most trusted sanitary destination in the region, known for quality, " +
  "honesty, and a customer-first experience that sets the standard for the industry.";

const VALUES = [
  { icon: "diamond", title: "Premium Quality", desc: "Only trusted brands and durable, certified products." },
  { icon: "handshake", title: "Honest Service", desc: "Fair pricing and transparent, no-pressure advice." },
  { icon: "local-shipping", title: "Reliable Supply", desc: "Consistent stock for homes, builders & contractors." },
  { icon: "support-agent", title: "Expert Support", desc: "Friendly help before, during, and after your purchase." },
];

const OWNERS = [
  {
    name: "Muhammad Basit",
    position: "Founder & CEO",
    desc: "Leads the vision of Basit Sanitary with a passion for quality and customer trust.",
    initials: "MB",
  },
  {
    name: "Operations Team",
    position: "Co-Founder & Head of Operations",
    desc: "Ensures every order is fulfilled with care, speed, and reliable after-sales support.",
    initials: "OT",
  },
];

const Section = ({ delay = 0, children, style }) => (
  <MotiView
    from={{ opacity: 0, translateY: 18 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 500, delay }}
    style={style}
  >
    {children}
  </MotiView>
);

export default function About() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <Section>
        <LinearGradient
          colors={[palette.ink, palette.emerald900, palette.emerald800]}
          locations={[0, 0.55, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.hero}
        >
          <View pointerEvents="none" style={[styles.heroGlow, styles.heroGlowTop]} />
          <View pointerEvents="none" style={[styles.heroGlow, styles.heroGlowBottom]} />

          <View style={styles.heroBadge}>
            <MaterialIcons name="water-drop" size={26} color={palette.white} />
          </View>
          <Text style={styles.heroEyebrow}>PREMIUM SANITARY STORE</Text>
          <Text style={styles.heroTitle}>Basit Sanitary</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroTagline}>
            Premium Bathroom & Sanitary Solutions
          </Text>
        </LinearGradient>
      </Section>

      {/* Stats */}
      <Section delay={120} style={styles.statsRow}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <MaterialIcons name={s.icon} size={22} color={palette.emerald700} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </Section>

      {/* About the shop */}
      <Section delay={180}>
        <Text style={styles.sectionTitle}>About the Shop</Text>
        <View style={styles.card}>
          <Text style={styles.bodyText}>{ABOUT_TEXT}</Text>
        </View>
      </Section>

      {/* Mission & Vision */}
      <Section delay={240}>
        <Text style={styles.sectionTitle}>Mission & Vision</Text>

        <LinearGradient
          colors={[palette.emerald700, palette.emerald800]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.mvCard, { marginBottom: space.md }]}
        >
          <View style={styles.mvIconWrap}>
            <MaterialIcons name="flag" size={20} color={palette.white} />
          </View>
          <Text style={styles.mvLabel}>OUR MISSION</Text>
          <Text style={styles.mvText}>{MISSION}</Text>
        </LinearGradient>

        <LinearGradient
          colors={[palette.ink2, palette.ink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mvCard}
        >
          <View style={[styles.mvIconWrap, { backgroundColor: "rgba(201,162,75,0.25)" }]}>
            <MaterialIcons name="visibility" size={20} color={palette.gold} />
          </View>
          <Text style={[styles.mvLabel, { color: palette.gold }]}>OUR VISION</Text>
          <Text style={styles.mvText}>{VISION}</Text>
        </LinearGradient>
      </Section>

      {/* Values */}
      <Section delay={300}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <View style={styles.valuesGrid}>
          {VALUES.map((v) => (
            <View key={v.title} style={styles.valueCard}>
              <View style={styles.valueIcon}>
                <MaterialIcons name={v.icon} size={20} color={palette.emerald700} />
              </View>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueDesc}>{v.desc}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Owners */}
      <Section delay={360}>
        <Text style={styles.sectionTitle}>Meet the Team</Text>
        {OWNERS.map((o) => (
          <View key={o.name} style={styles.ownerCard}>
            <LinearGradient
              colors={[palette.emerald500, palette.emerald800]}
              style={styles.ownerAvatar}
            >
              <Text style={styles.ownerInitials}>{o.initials}</Text>
            </LinearGradient>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{o.name}</Text>
              <View style={styles.ownerPositionPill}>
                <Text style={styles.ownerPosition}>{o.position}</Text>
              </View>
              <Text style={styles.ownerDesc}>{o.desc}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Section delay={420} style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          Thank you for choosing <Text style={styles.footerBrand}>Basit Sanitary</Text>
        </Text>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  content: { paddingBottom: space["5xl"] },

  // Hero
  hero: {
    paddingTop: space["4xl"],
    paddingBottom: space["4xl"],
    paddingHorizontal: space.xl,
    alignItems: "center",
    borderBottomLeftRadius: radius["2xl"],
    borderBottomRightRadius: radius["2xl"],
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
  },
  heroGlowTop: { top: -width * 0.3, right: -width * 0.25, backgroundColor: palette.emerald500, opacity: 0.2 },
  heroGlowBottom: { bottom: -width * 0.35, left: -width * 0.25, backgroundColor: palette.emerald700, opacity: 0.22 },
  heroBadge: {
    width: 64, height: 64, borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center", marginBottom: space.lg,
  },
  heroEyebrow: {
    ...typography.micro, color: palette.gold,
    letterSpacing: 3, textTransform: "uppercase", marginBottom: space.xs,
  },
  heroTitle: { fontSize: 32, fontWeight: "800", color: palette.white, letterSpacing: 0.4 },
  heroDivider: { width: 52, height: 3, borderRadius: 2, backgroundColor: palette.gold, marginVertical: space.md },
  heroTagline: { ...typography.bodyLg, color: palette.emerald100, opacity: 0.9, textAlign: "center" },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: space.md,
    paddingHorizontal: space.lg,
    marginTop: -space["2xl"],
    marginBottom: space.xl,
  },
  statCard: {
    flex: 1, alignItems: "center", paddingVertical: space.lg, paddingHorizontal: space.sm,
    backgroundColor: colors.bg.surface, borderRadius: radius.lg, ...shadows.e2,
  },
  statValue: { fontSize: 20, fontWeight: "800", color: colors.text.primary, marginTop: space.xs },
  statLabel: { ...typography.caption, color: colors.text.muted, textAlign: "center", marginTop: 2 },

  // Generic section
  sectionTitle: {
    ...typography.h2, color: colors.text.primary,
    paddingHorizontal: space.lg, marginBottom: space.md, marginTop: space.lg,
  },
  card: {
    backgroundColor: colors.bg.surface, marginHorizontal: space.lg,
    padding: space.xl, borderRadius: radius.lg, ...shadows.e1,
  },
  bodyText: { ...typography.bodyLg, color: colors.text.secondary, lineHeight: 24, textAlign: "justify" },

  // Mission / Vision
  mvCard: {
    marginHorizontal: space.lg, padding: space.xl, borderRadius: radius.lg, ...shadows.e2,
  },
  mvIconWrap: {
    width: 40, height: 40, borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center", marginBottom: space.md,
  },
  mvLabel: { ...typography.label, color: palette.emerald100, letterSpacing: 2, marginBottom: space.sm },
  mvText: { ...typography.bodyLg, color: palette.white, opacity: 0.95, lineHeight: 24 },

  // Values grid
  valuesGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: space.md, paddingHorizontal: space.lg,
  },
  valueCard: {
    width: (width - space.lg * 2 - space.md) / 2,
    backgroundColor: colors.bg.surface, borderRadius: radius.lg, padding: space.lg, ...shadows.e1,
  },
  valueIcon: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.brand.tint,
    alignItems: "center", justifyContent: "center", marginBottom: space.md,
  },
  valueTitle: { ...typography.h3, color: colors.text.primary, marginBottom: space.xs },
  valueDesc: { ...typography.caption, color: colors.text.muted, lineHeight: 18 },

  // Owners
  ownerCard: {
    flexDirection: "row", marginHorizontal: space.lg, marginBottom: space.md,
    backgroundColor: colors.bg.surface, borderRadius: radius.lg, padding: space.lg, ...shadows.e1,
  },
  ownerAvatar: {
    width: 64, height: 64, borderRadius: radius.pill,
    alignItems: "center", justifyContent: "center", marginRight: space.lg,
  },
  ownerInitials: { fontSize: 22, fontWeight: "800", color: palette.white, letterSpacing: 0.5 },
  ownerInfo: { flex: 1 },
  ownerName: { ...typography.h3, color: colors.text.primary },
  ownerPositionPill: {
    alignSelf: "flex-start", backgroundColor: colors.brand.tint,
    paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: radius.pill,
    marginTop: 4, marginBottom: space.sm,
  },
  ownerPosition: { ...typography.micro, color: colors.brand.primaryDark, fontWeight: "700" },
  ownerDesc: { ...typography.body, color: colors.text.secondary, lineHeight: 20 },

  // Footer
  footer: { alignItems: "center", marginTop: space["2xl"], paddingHorizontal: space.lg },
  footerLine: { width: 40, height: 2, borderRadius: 1, backgroundColor: colors.border.strong, marginBottom: space.md },
  footerText: { ...typography.body, color: colors.text.muted },
  footerBrand: { color: colors.brand.primary, fontWeight: "700" },
});
