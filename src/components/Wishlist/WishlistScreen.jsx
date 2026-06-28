// WishlistScreen — saved products grid backed by WishlistContext.

import React, { useContext } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useWishlist } from "../../ContextApis/WishlistContext";
import { CartContext } from "../../ContextApis/cartContext";
import { apiFetch } from "../../apiFetch";
import { endpoints } from "../../services/endpoints";
import ProductCard from "../../components/commerce/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";

const { width } = Dimensions.get("window");
const GAP = space.lg;
const CARD_WIDTH = (width - GAP * 3) / 2;

const WishlistScreen = ({ navigation }) => {
  const { wishlistItems, isWishlisted, toggleWishlist } = useWishlist();
  const { fetchCartCount, bumpCartCount } = useContext(CartContext);

  const handleAddToCart = (product) => {
    // Optimistic badge bump, then sync with the server.
    bumpCartCount(1);
    apiFetch(endpoints.cart.add, {
      method: "POST",
      body: JSON.stringify({ ...product, quantity: 1, selectedColor: "None" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("add failed");
        fetchCartCount();
      })
      .catch((e) => {
        bumpCartCount(-1);
        if (__DEV__) console.warn("add to cart failed", e);
      });
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
