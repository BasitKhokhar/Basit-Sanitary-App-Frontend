// ProductCard — canonical image-first luxury card.
// Replaces the duplicated card markup in ProductsScreen, OnSaleProducts,
// TrendingProducts, Completesets. Memoized for smooth list scrolling.
//
// variant:
//   "standard" (default) — image on top, info panel below. Used in grids /
//                          Trending / On Sale rails.
//   "showcase"           — taller full-bleed image with the name + price
//                          overlaid on a gradient. Used for curated
//                          collections (Complete Sets) for a richer look.

import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialIcons";
import PressableScale from "../ui/PressableScale";
import AppText from "../ui/Text";
import PriceTag from "../ui/PriceTag";
import RatingStars from "../ui/RatingStars";
import Badge from "../ui/Badge";
import HeartButton from "../ui/HeartButton";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const fmt = (n, currency = "Rs") => `${currency} ${Number(n || 0).toLocaleString()}`;

const ProductCard = ({
  product,
  width = 170,
  variant = "standard",
  onPress,
  onAddToCart,
  wishlisted = false,
  onToggleWishlist,
  currency = "Rs",
  style,
}) => {
  const {
    name,
    image_url,
    price,
    original_price,
    old_price,
    rating,
    reviews_count,
    stock,
    on_sale,
  } = product || {};

  const originalPrice = original_price ?? old_price;
  const outOfStock = stock != null && Number(stock) <= 0;

  // ----- Showcase variant -------------------------------------------------
  if (variant === "showcase") {
    const height = Math.round(width * 1.18);
    return (
      <PressableScale
        onPress={() => onPress?.(product)}
        style={[styles.showcaseCard, { width, height }, style]}
        accessibilityLabel={name}
      >
        <Image source={{ uri: image_url }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(12,26,20,0.15)", "rgba(7,53,31,0.92)"]}
          locations={[0.35, 0.6, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Top row: sale badge + wishlist */}
        <View style={styles.topRow}>
          {on_sale || originalPrice ? <Badge label="SALE" tone="error" size="sm" /> : <View />}
          <HeartButton active={wishlisted} onToggle={() => onToggleWishlist?.(product)} size={18} />
        </View>

        {outOfStock ? (
          <View style={styles.showcaseSoldOut}>
            <Badge label="Out of stock" tone="neutral" />
          </View>
        ) : null}

        {/* Bottom overlay info */}
        <View style={styles.showcaseInfo}>
          <AppText variant="bodyLg" color="onPrimary" weight="700" numberOfLines={2}>
            {name}
          </AppText>
          <View style={styles.showcasePriceRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="h3" color="onPrimary" weight="800">
                {fmt(Math.floor(price || 0), currency)}
              </AppText>
              {originalPrice ? (
                <AppText
                  variant="caption"
                  style={{ color: "rgba(255,255,255,0.7)", textDecorationLine: "line-through" }}
                >
                  {fmt(Math.floor(originalPrice), currency)}
                </AppText>
              ) : null}
            </View>
            <PressableScale
              onPress={() => !outOfStock && onAddToCart?.(product)}
              disabled={outOfStock}
              style={[styles.showcaseAddBtn, outOfStock && { opacity: 0.4 }]}
              accessibilityLabel={`Add ${name} to cart`}
            >
              <Icon name="add-shopping-cart" size={20} color={colors.brand.primary} />
            </PressableScale>
          </View>
        </View>
      </PressableScale>
    );
  }

  // ----- Standard variant -------------------------------------------------
  const imgSize = width;
  return (
    <PressableScale onPress={() => onPress?.(product)} style={[styles.card, { width }, style]} accessibilityLabel={name}>
      {/* Image area */}
      <View style={[styles.imageWrap, { height: imgSize }]}>
        <Image source={{ uri: image_url }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(12,26,20,0.04)"]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Top row: sale badge + wishlist */}
        <View style={styles.topRow}>
          {on_sale || originalPrice ? <Badge label="SALE" tone="error" size="sm" /> : <View />}
          <HeartButton active={wishlisted} onToggle={() => onToggleWishlist?.(product)} size={18} />
        </View>

        {outOfStock ? (
          <View style={styles.soldOut}>
            <Badge label="Out of stock" tone="neutral" />
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <AppText variant="label" color="primary" numberOfLines={2} style={styles.name}>
          {name}
        </AppText>

        {rating != null ? (
          <RatingStars rating={Number(rating)} count={reviews_count} size={12} style={{ marginTop: 2 }} />
        ) : null}

        <PriceTag
          price={Math.floor(price || 0)}
          originalPrice={originalPrice ? Math.floor(originalPrice) : undefined}
          currency={currency}
          size="bodyLg"
          style={{ marginTop: space.xs }}
        />
      </View>

      {/* Add to cart */}
      <PressableScale
        onPress={() => !outOfStock && onAddToCart?.(product)}
        disabled={outOfStock}
        style={[styles.addBtn, outOfStock && { opacity: 0.4 }]}
        accessibilityLabel={`Add ${name} to cart`}
      >
        <Icon name="add-shopping-cart" size={18} color={colors.text.onPrimary} />
      </PressableScale>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: "hidden",
    ...shadows.e2,
  },
  imageWrap: { width: "100%", backgroundColor: colors.bg.sunken },
  image: { width: "100%", height: "100%" },
  topRow: {
    position: "absolute",
    top: space.sm,
    left: space.sm,
    right: space.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  soldOut: { position: "absolute", bottom: space.sm, left: space.sm },
  info: { padding: space.md, paddingBottom: space.lg },
  name: { minHeight: 36 },
  addBtn: {
    position: "absolute",
    right: space.md,
    bottom: space.md,
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.brand,
  },

  // Showcase variant
  showcaseCard: {
    backgroundColor: colors.bg.sunken,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadows.e3,
  },
  showcaseSoldOut: { position: "absolute", top: 44, left: space.sm },
  showcaseInfo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
  },
  showcasePriceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: space.sm,
  },
  showcaseAddBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.e2,
  },
});

export default React.memo(ProductCard);
