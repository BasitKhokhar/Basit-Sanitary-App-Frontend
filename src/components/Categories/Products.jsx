// Products (by subcategory) — premium grid using the canonical ProductCard,
// matching ProductsScreen / Home rails for a consistent look.

import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWishlist } from "../../ContextApis/WishlistContext";
import ProductModal from "../Products/ProductModal";
import ProductCard from "../commerce/ProductCard";
import { ProductCardSkeleton } from "../ui/Skeleton";
import AppText from "../ui/Text";
import EmptyState from "../ui/EmptyState";
import { apiFetch } from "../../apiFetch";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";

const { width } = Dimensions.get("window");
const GAP = space.lg;
const CARD_WIDTH = (width - GAP * 3) / 2;

const Products = ({ route }) => {
  const { subcategoryId } = route.params;
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiFetch(`/products/subcategories/${subcategoryId}/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      if (__DEV__) console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [subcategoryId]);

  useEffect(() => {
    (async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
      } catch (e) {}
    })();
    fetchProducts();
  }, [fetchProducts]);

  // Tapping a card or its cart icon opens the modal first (choose finish,
  // review details) — consistent with the rest of the app.
  const openCartModal = (product) => setSelectedProduct(product);

  const renderHeader = () => (
    <View style={styles.header}>
      <AppText variant="h2">Products</AppText>
      {!loading ? (
        <AppText variant="caption" color="muted">{products.length} items</AppText>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} width={CARD_WIDTH} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="inventory-2" title="No products found" subtitle="Please check back later." />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={CARD_WIDTH}
            onPress={openCartModal}
            onAddToCart={openCartModal}
            wishlisted={isWishlisted(item.id)}
            onToggleWishlist={toggleWishlist}
          />
        )}
      />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} userId={userId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  list: { paddingBottom: 120 },
  header: { paddingHorizontal: GAP, paddingVertical: space.md },
  skeletonGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: GAP, gap: GAP },
});

export default Products;
