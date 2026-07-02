import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '../ui/Text';
import { colors } from '../../theme/colors';
import { space } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

// Icon mapping array
const icons = ['car', 'life-ring', 'rotate-right', 'lock'];

// Premium brand-aligned gradients (emerald / ink / gold) — replaces the
// clashing rainbow palette so the section sits within the design system.
const gradients = [
  colors.gradients.emeraldDeep,
  colors.gradients.dark,
  colors.gradients.emeraldGlow,
  colors.gradients.gold,
];

const Card = ({ item, index, tall }) => {
  const gradient = gradients[index % gradients.length] || colors.gradients.emeraldDeep;
  const icon = icons[index % icons.length] || 'info-circle';

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, tall ? styles.tallCard : styles.shortCard]}
    >
      {/* Decorative sheen in the corner for a glossy, premium feel */}
      <View style={styles.sheen} pointerEvents="none" />

      <View style={styles.iconBadge}>
        <FontAwesome name={icon} size={26} color={colors.text.onPrimary} />
      </View>

      <AppText variant="h3" color="onPrimary" align="center" style={styles.heading} numberOfLines={2}>
        {item.headings || 'No Title'}
      </AppText>
      <AppText variant="caption" color="inverse" align="center" style={styles.description} numberOfLines={3}>
        {item.description || 'No Description'}
      </AppText>
    </LinearGradient>
  );
};

const CustomerSupportOptions = ({ firstColumnData = [], secondColumnData = [] }) => {
  if (!firstColumnData.length && !secondColumnData.length) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerText}>
          <AppText variant="h2" color="primary">Why shop with us</AppText>
          <AppText variant="caption" color="muted">Service you can count on, every order</AppText>
        </View>
      </View>

      <View style={styles.grid}>
        {/* First Column */}
        <View style={styles.column}>
          {firstColumnData.map((item, index) => (
            <Card key={item.id || `c1-${index}`} item={item} index={index} tall={index === 0} />
          ))}
        </View>

        {/* Second Column */}
        <View style={styles.column}>
          {secondColumnData.map((item, index) => (
            <Card key={item.id || `c2-${index}`} item={item} index={index + 2} tall={index !== 0} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
    paddingHorizontal: space.xs,
  },
  headerAccent: {
    width: 4,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.base,
    marginRight: space.md,
  },
  headerText: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  card: {
    padding: space.lg,
    margin: space.sm,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.e3,
  },
  sheen: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tallCard: {
    height: 220,
  },
  shortCard: {
    height: 170,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  heading: {
    marginBottom: space.xs,
  },
  description: {
    opacity: 0.92,
    lineHeight: 18,
  },
});

export default CustomerSupportOptions;
