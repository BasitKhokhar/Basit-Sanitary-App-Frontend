import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "@expo/vector-icons/MaterialIcons";
import ProductModal from "./ProductModal";
import { apiFetch } from "../../apiFetch";
import { endpoints } from "../../services/endpoints";
import { useWishlist } from "../../ContextApis/WishlistContext";
import ProductCard from "../../components/commerce/ProductCard";
import { ProductCardSkeleton } from "../../components/ui/Skeleton";
import AppText from "../../components/ui/Text";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { width } = Dimensions.get("window");
const GAP = space.lg;
const CARD_WIDTH = (width - GAP * 3) / 2;
const PAGE_SIZE = 10;

const SORTS = [
  { label: "Name: A to Z", value: "az" },
  { label: "Name: Z to A", value: "za" },
  { label: "Price: Low to High", value: "priceLowHigh" },
  { label: "Price: High to Low", value: "priceHighLow" },
];

const ProductsScreen = () => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState("az");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
      } catch (e) {}
    })();
  }, []);

  const sortList = useCallback((list, order) => {
    const arr = [...list];
    if (order === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (order === "za") arr.sort((a, b) => b.name.localeCompare(a.name));
    else if (order === "priceLowHigh") arr.sort((a, b) => a.price - b.price);
    else if (order === "priceHighLow") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, []);

  const fetchProducts = useCallback(
    async (pageNum = 1) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await apiFetch(endpoints.products.all(pageNum, PAGE_SIZE));
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        const fetched = sortList(data.products || [], sortOrder);

        if (pageNum === 1) setProducts(fetched);
        else
          setProducts((prev) => {
            const seen = new Set(prev.map((p) => p.id));
            return [...prev, ...fetched.filter((p) => !seen.has(p.id))];
          });

        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch (err) {
        if (__DEV__) console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [sortOrder, sortList]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(1);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore || loading) return;
    fetchProducts(page + 1);
  };

  // Tapping the cart icon opens the product/cart modal first (choose finish,
  // review details) — the actual add happens from inside the modal.
  const openCartModal = (product) => setSelectedProduct(product);

  const pickSort = (value) => {
    setSortOrder(value);
    setSortOpen(false);
    setProducts((prev) => sortList(prev, value));
  };

  const renderHeader = () => (
    <View style={styles.toolbar}>
      <View>
        <AppText variant="h2">All Products</AppText>
        <AppText variant="caption" color="muted">{products.length} items</AppText>
      </View>
      <Pressable style={styles.sortBtn} onPress={() => setSortOpen(true)} accessibilityRole="button" accessibilityLabel="Sort products">
        <Icon name="tune" size={18} color={colors.text.primary} />
        <AppText variant="label" weight="600" style={{ marginLeft: 6 }}>Sort</AppText>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && page === 1 ? (
        <View style={styles.skeletonWrap}>
          {renderHeader()}
          <View style={styles.skeletonGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} width={CARD_WIDTH} />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderHeader}
          columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="inventory-2" title="No products found" subtitle="Please check back later." />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              width={CARD_WIDTH}
              onPress={setSelectedProduct}
              onAddToCart={openCartModal}
              wishlisted={isWishlisted(item.id)}
              onToggleWishlist={toggleWishlist}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.brand.primary} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: space.xl }}>
                <ActivityIndicator size="small" color={colors.brand.primary} />
              </View>
            ) : null
          }
        />
      )}

      {selectedProduct && (
        <ProductModal userId={userId} product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Sheet visible={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        {SORTS.map((s) => {
          const active = s.value === sortOrder;
          return (
            <Pressable key={s.value} style={styles.sortRow} onPress={() => pickSort(s.value)} accessibilityRole="button">
              <AppText variant="bodyLg" color={active ? "brand" : "primary"} weight={active ? "700" : "400"}>
                {s.label}
              </AppText>
              {active ? <Icon name="check-circle" size={20} color={colors.brand.primary} /> : null}
            </Pressable>
          );
        })}
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  list: { paddingBottom: 120 },
  skeletonWrap: { flex: 1 },
  skeletonGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: GAP, gap: GAP },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: GAP,
    paddingVertical: space.md,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.surface,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    ...shadows.e1,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
});

export default ProductsScreen;
