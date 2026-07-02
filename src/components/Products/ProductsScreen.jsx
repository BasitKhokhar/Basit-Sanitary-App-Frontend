import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Pressable,
  TextInput,
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

  // Search: `searchInput` is what the user types; `query` is the debounced
  // value actually used for fetching so we don't hit the API on every keypress.
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

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
    const name = (p) => (p?.name ?? "").toString();
    if (order === "az") arr.sort((a, b) => name(a).localeCompare(name(b)));
    else if (order === "za") arr.sort((a, b) => name(b).localeCompare(name(a)));
    else if (order === "priceLowHigh") arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (order === "priceHighLow") arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    return arr;
  }, []);

  // Debounce the search input into `query` (resets paging back to page 1).
  useEffect(() => {
    const t = setTimeout(() => setQuery(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProducts = useCallback(
    async (pageNum = 1) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const url = query
          ? endpoints.products.search(query, pageNum, PAGE_SIZE)
          : endpoints.products.all(pageNum, PAGE_SIZE);
        const res = await apiFetch(url);
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
    [sortOrder, sortList, query]
  );

  // Refetch from page 1 whenever the search query changes.
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

  // Stable list callbacks so React.memo(ProductCard) actually skips re-renders
  // and the separator component isn't re-created on every keystroke/render.
  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        width={CARD_WIDTH}
        onPress={setSelectedProduct}
        onAddToCart={openCartModal}
        wishlisted={isWishlisted(item.id)}
        onToggleWishlist={toggleWishlist}
      />
    ),
    [isWishlisted, toggleWishlist]
  );
  const keyExtractor = useCallback((item) => String(item.id), []);
  const ItemSeparator = useCallback(() => <View style={{ height: GAP }} />, []);

  const renderHeader = () => (
    <View style={styles.headerWrap}>
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

      <View style={styles.searchBar}>
        <Icon name="search" size={20} color={colors.text.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.text.muted}
          value={searchInput}
          onChangeText={setSearchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchInput.length > 0 && (
          <Pressable onPress={() => setSearchInput("")} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear search">
            <Icon name="close" size={20} color={colors.text.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Fixed header (kept outside the list so the search field doesn't lose focus). */}
      {renderHeader()}

      {loading && page === 1 ? (
        <View style={styles.skeletonWrap}>
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
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.list}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          removeClippedSubviews
          ListEmptyComponent={
            <EmptyState
              icon="inventory-2"
              title="No products found"
              subtitle={query ? `No results for "${query}".` : "Please check back later."}
            />
          }
          renderItem={renderItem}
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
  headerWrap: { backgroundColor: colors.bg.canvas },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: GAP,
    paddingVertical: space.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: GAP,
    marginBottom: space.md,
    paddingHorizontal: space.lg,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.pill,
    ...shadows.e1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    fontSize: 15,
    color: colors.text.primary,
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
