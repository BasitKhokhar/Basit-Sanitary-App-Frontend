// ProductCarousel — horizontal product rail with a section header.
// Single implementation replacing OnSaleProducts / TrendingProducts /
// Completesets duplication. Pass data + handlers.

import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import ProductCard from "./ProductCard";
import AppText from "../ui/Text";
import PressableScale from "../ui/PressableScale";
import { ProductCardSkeleton } from "../ui/Skeleton";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";

const CARD_WIDTH = 160;

const ProductCarousel = ({
  title,
  subtitle,
  data = [],
  loading = false,
  onSeeAll,
  onPressItem,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  style,
}) => {
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
            <ProductCardSkeleton key={i} width={CARD_WIDTH} />
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: space.md }} />}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              width={CARD_WIDTH}
              onPress={onPressItem}
              onAddToCart={onAddToCart}
              wishlisted={isWishlisted?.(item.id)}
              onToggleWishlist={onToggleWishlist}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: space.xl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    marginBottom: space.md,
  },
  seeAll: { flexDirection: "row", alignItems: "center" },
  listContent: { paddingHorizontal: space.lg },
  row: { flexDirection: "row", paddingHorizontal: space.lg, gap: space.md },
});

export default React.memo(ProductCarousel);
