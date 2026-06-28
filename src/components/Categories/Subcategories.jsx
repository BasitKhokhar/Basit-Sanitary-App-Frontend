// Subcategories — premium 2-column grid of image tiles with the name
// overlaid on an emerald gradient, matching the Categories rail.

import React, { useEffect, useState } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useRoute, useNavigation } from "@react-navigation/native";
import PressableScale from "../ui/PressableScale";
import AppText from "../ui/Text";
import EmptyState from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { apiFetch } from "../../apiFetch";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { width } = Dimensions.get("window");
const GAP = space.lg;
const TILE_W = (width - GAP * 3) / 2;
const TILE_H = Math.round(TILE_W * 0.85);

const SubcategoryTile = ({ item, onPress }) => {
  const [failed, setFailed] = useState(false);
  return (
    <PressableScale style={styles.tile} onPress={onPress} accessibilityLabel={item.name}>
      {!failed && item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" onError={() => setFailed(true)} />
      ) : (
        <View style={[styles.image, styles.fallback]}>
          <Icon name="grid-view" size={28} color={colors.brand.primary} />
        </View>
      )}

      <LinearGradient
        colors={["transparent", "rgba(12,26,20,0.15)", "rgba(7,53,31,0.92)"]}
        locations={[0.4, 0.65, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.labelWrap}>
        <AppText variant="label" color="onPrimary" weight="700" numberOfLines={2}>
          {item.name}
        </AppText>
        <View style={styles.shopRow}>
          <AppText variant="micro" style={{ color: "rgba(255,255,255,0.8)" }}>View products</AppText>
          <Icon name="arrow-forward" size={12} color="rgba(255,255,255,0.8)" style={{ marginLeft: 2 }} />
        </View>
      </View>
    </PressableScale>
  );
};

const Subcategories = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params;

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    (async () => {
      try {
        const response = await apiFetch(`/products/categories/${categoryId}/subcategories`);
        const data = await response.json();
        setSubcategories(Array.isArray(data) ? data : []);
      } catch (error) {
        if (__DEV__) console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  const renderHeader = () => (
    <View style={styles.header}>
      <AppText variant="h2">Subcategories</AppText>
      {!loading ? (
        <AppText variant="caption" color="muted">{subcategories.length} collections</AppText>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width={TILE_W} height={TILE_H} rounded={radius.xl} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subcategories}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="grid-view" title="No subcategories found" subtitle="Please check back later." />
        }
        renderItem={({ item }) => (
          <SubcategoryTile
            item={item}
            onPress={() => navigation.navigate("Products", { subcategoryId: item.id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  list: { paddingBottom: 120 },
  header: { paddingHorizontal: GAP, paddingVertical: space.md },
  skeletonGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: GAP, gap: GAP },
  tile: {
    width: TILE_W,
    height: TILE_H,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.bg.sunken,
    ...shadows.e3,
  },
  image: { width: "100%", height: "100%" },
  fallback: { justifyContent: "center", alignItems: "center", backgroundColor: colors.brand.tint },
  labelWrap: { position: "absolute", left: 0, right: 0, bottom: 0, padding: space.md },
  shopRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
});

export default Subcategories;
