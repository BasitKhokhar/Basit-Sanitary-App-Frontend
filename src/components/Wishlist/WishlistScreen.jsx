// WishlistScreen — saved products grid backed by WishlistContext.

import React, { useContext } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useWishlist } from "../../src/ContextApis/WishlistContext";
import { CartContext } from "../../src/ContextApis/cartContext";
import { apiFetch } from "../../src/apiFetch";
import { endpoints } from "../../src/services/endpoints";
import ProductCard from "../../src/components/commerce/ProductCard";
import EmptyState from "../../src/components/ui/EmptyState";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";

const { width } = Dimensions.get("window");
const GAP = space.lg;
const CARD_WIDTH = (width - GAP * 3) / 2;

const WishlistScreen = ({ navigation }) => {
  const { wishlistItems, isWishlisted, toggleWishlist } = useWishlist();
  const { fetchCartCount } = useContext(CartContext);

  const handleAddToCart = async (product) => {
    try {
      await apiFetch(endpoints.cart.add, {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      fetchCartCount();
    } catch (e) {
      if (__DEV__) console.warn("add to cart failed", e);
    }
  };

  if (!wishlistItems.length) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="favorite-border"
          title="Your wishlist is empty"
          subtitle="Tap the heart on any product to save it here for later."
          actionLabel="Browse products"
          onAction={() => navigation.navigate("Main")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlistItems}
        numColumns={2}
        keyExtractor={(item, i) => String(item?.id ?? i)}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={CARD_WIDTH}
            onPress={() => navigation.navigate("Main")}
            onAddToCart={handleAddToCart}
            wishlisted={isWishlisted(item.id)}
            onToggleWishlist={toggleWishlist}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  list: { padding: GAP, paddingBottom: space["4xl"] },
});

export default WishlistScreen;
