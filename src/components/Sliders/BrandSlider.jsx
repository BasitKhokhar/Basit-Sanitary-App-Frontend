// BrandSlider — premium "Our Brands" showcase.
// Deep emerald gradient backdrop with clean white logo cards on a grid,
// matching the app's emerald design language.

import React from "react";
import { View, Image, FlatList, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialIcons";
import AppText from "../ui/Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { width } = Dimensions.get("window");
const COLS = 3;
const GAP = space.md;
const H_PAD = space.lg;
const CARD_W = (width - H_PAD * 2 - GAP * (COLS - 1)) / COLS;

const BrandSlider = ({ brands }) => {
  const filteredBrands = Array.isArray(brands)
    ? brands.filter((item) => item?.id && item?.image_url)
    : [];

  return (
    <LinearGradient
      colors={colors.gradients.emeraldDeep}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Icon name="verified" size={20} color={colors.accent.base} />
          <AppText variant="h3" color="onPrimary" weight="700" style={styles.title}>
            Our Brands
          </AppText>
        </View>
        <AppText variant="caption" style={styles.subtitle}>
          Trusted names we proudly carry
        </AppText>
      </View>

      <FlatList
        data={filteredBrands}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        numColumns={COLS}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image_url }}
              style={styles.brandImage}
              resizeMode="contain"
              onError={() => console.warn("Failed to load brand image:", item.image_url)}
            />
          </View>
        )}
        ListEmptyComponent={
          <AppText variant="body" style={styles.empty}>
            No brands available
          </AppText>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: space["2xl"],
    paddingHorizontal: H_PAD,
    borderRadius: radius.xl,
    marginHorizontal: space.lg,
    marginBottom: space["2xl"],
    ...shadows.e3,
  },
  header: {
    marginBottom: space.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: space.xs,
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  listContent: {},
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: GAP,
  },
  card: {
    width: CARD_W,
    height: CARD_W * 0.66,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: space.sm,
    ...shadows.e2,
  },
  brandImage: {
    width: "100%",
    height: "100%",
  },
  empty: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    width: "100%",
  },
});

export default BrandSlider;
