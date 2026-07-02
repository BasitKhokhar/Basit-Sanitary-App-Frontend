// ProductCarousel — horizontal product rail with a section header.
// Single implementation replacing OnSaleProducts / TrendingProducts /
// Completesets duplication. Pass data + handlers.
//
// variant:
//   "standard" (default) — compact image-first cards (Trending).
//   "showcase"           — wider full-bleed cards for curated collections
//                          (Complete Sets).
//   "deal"               — gold-accented premium offer cards (On Sale).

import React, { useMemo, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import ProductCard from "./ProductCard";
import AppText from "../ui/Text";
import PressableScale from "../ui/PressableScale";
import { ProductCardSkeleton } from "../ui/Skeleton";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";

const CARD_WIDTH = { standard: 164, showcase: 240, deal: 180 };

const ProductCarousel = ({
  title,
  subtitle,
  data = [],
  loading = false,
  variant = "standard",
  onSeeAll,
  onPressItem,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  style,
}) => {
  const cardWidth = CARD_WIDTH[variant] || CARD_WIDTH.standard;

  // The backend can return the same product more than once (e.g. a JOIN over
  // images/finishes without DISTINCT). Dedupe by id so we never render a
  // product twice or collide on FlatList keys ("two children with same key").
  const items = useMemo(() => {
    const seen = new Set();
    return (data || []).filter((p) => {
      const id = p?.id;
      if (id == null) return true; // keep id-less rows; key falls back to index
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [data]);

  const keyExtractor = useCallback((item, i) => String(item?.id ?? `idx-${i}`), []);
  const ItemSeparator = useCallback(() => <View style={{ width: space.md }} />, []);
  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        width={cardWidth}
        variant={variant}
        onPress={onPressItem}
        onAddToCart={onAddToCart}
        wishlisted={isWishlisted?.(item.id)}
        onToggleWishlist={onToggleWishlist}
      />
    ),
    [cardWidth, variant, onPressItem, onAddToCart, isWishlisted, onToggleWishlist]
  );

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="h3">{title}</AppText>
          {subtitle ? (
            <AppText variant="caption" color="muted" style={{ marginTop: 2 }}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {onSeeAll ? (
          <PressableScale onPress={onSeeAll} style={styles.seeAll} accessibilityLabel={`See all ${title}`}>
            <AppText variant="label" color="brand" weight="700">
              See all
            </AppText>
            <Icon name="chevron-right" size={18} color={colors.brand.primary} />
          </PressableScale>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.row}>
          {[0, 1, 2].map((i) => (
            <ProductCardSkeleton key={i} width={cardWidth} />
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={items}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={renderItem}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: space["2xl"] },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    marginBottom: space.md,
  },
  seeAll: { flexDirection: "row", alignItems: "center" },
  // Vertical padding gives the card shadows room to render and keeps the rail
  // from touching the next section's heading.
  listContent: { paddingHorizontal: space.lg, paddingVertical: space.sm },
  row: { flexDirection: "row", paddingHorizontal: space.lg, paddingVertical: space.sm, gap: space.md },
});

export default React.memo(ProductCarousel);
