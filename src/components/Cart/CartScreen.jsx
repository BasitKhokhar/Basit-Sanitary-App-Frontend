import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, FlatList, Image, Alert, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { CartContext } from "../../ContextApis/cartContext";
import { apiFetch } from "../../apiFetch";
import { endpoints } from "../../services/endpoints";

import AppText from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import QuantityStepper from "../../components/ui/QuantityStepper";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const SHIPPING_FREE_OVER = 5000;

const CartRow = React.memo(({ item, onQty, onRemove }) => (
  <Card style={styles.row} padded={false}>
    <Image source={{ uri: item.image_url }} style={styles.image} />
    <View style={styles.rowInfo}>
      <AppText variant="label" weight="700" numberOfLines={2}>{item.name}</AppText>
      <AppText variant="caption" color="muted" style={{ marginTop: 2 }}>
        Rs {Number(item.price).toLocaleString()} each
      </AppText>
      <View style={styles.rowBottom}>
        <QuantityStepper
          value={item.quantity}
          size="sm"
          onChange={(q) => onQty(item.cart_id, q)}
        />
        <AppText variant="bodyLg" weight="800" color="brand">
          Rs {(item.price * item.quantity).toLocaleString()}
        </AppText>
      </View>
    </View>
    <Pressable onPress={() => onRemove(item.cart_id)} style={styles.removeBtn} hitSlop={8} accessibilityLabel="Remove item">
      <Icon name="close" size={16} color={colors.text.muted} />
    </Pressable>
  </Card>
));

const CartScreen = () => {
  const { fetchCartCount, bumpCartCount } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in");
      const response = await apiFetch(endpoints.cart.items);
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      if (__DEV__) console.warn(error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchCartItems(); }, []));

  const handleRefresh = () => { setRefreshing(true); fetchCartItems(); };

  const handleRemoveFromCart = async (cartId) => {
    // Optimistic: drop the row immediately, restore it if the server fails.
    const prevItems = cartItems;
    const removed = prevItems.find((i) => i.cart_id === cartId);
    setCartItems((prev) => prev.filter((i) => i.cart_id !== cartId));
    bumpCartCount(-(removed?.quantity || 0));
    try {
      const response = await apiFetch(`/cart/${cartId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove item");
      fetchCartCount();
    } catch (error) {
      setCartItems(prevItems); // rollback
      bumpCartCount(removed?.quantity || 0);
      Alert.alert("Error", error.message);
    }
  };

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    // Optimistic: update the quantity immediately, reconcile/rollback after.
    const prevItems = cartItems;
    const current = prevItems.find((i) => i.cart_id === cartId);
    const delta = newQuantity - (current?.quantity || 0);
    setCartItems((prev) => prev.map((i) => (i.cart_id === cartId ? { ...i, quantity: newQuantity } : i)));
    bumpCartCount(delta);
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await apiFetch(`/cart/${cartId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: newQuantity, user_id: userId }),
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      fetchCartCount();
    } catch (error) {
      setCartItems(prevItems); // rollback
      bumpCartCount(-delta);
      Alert.alert("Error", error.message);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShipping = subtotal >= SHIPPING_FREE_OVER || subtotal === 0;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={{ padding: space.lg }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={96} rounded={radius.lg} style={{ marginBottom: space.md }} />
          ))}
        </View>
      </View>
    );
  }

  if (!cartItems.length) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="shopping-bag"
          title="Your cart is empty"
          subtitle="Browse our premium sanitary collection and add items to your cart."
          actionLabel="Start shopping"
          onAction={() => navigation.navigate("Products")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.cart_id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <AppText variant="h2" style={{ marginBottom: space.lg }}>
            Your Cart ({cartItems.length})
          </AppText>
        }
        ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
        renderItem={({ item }) => (
          <CartRow item={item} onQty={handleQuantityChange} onRemove={handleRemoveFromCart} />
        )}
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <AppText variant="body" color="secondary">Subtotal</AppText>
          <AppText variant="bodyLg" weight="700">Rs {subtotal.toLocaleString()}</AppText>
        </View>
        <View style={styles.summaryRow}>
          <AppText variant="body" color="secondary">Shipping</AppText>
          <AppText variant="label" weight="700" color={freeShipping ? "success" : "primary"}>
            {freeShipping ? "FREE" : "Calculated at checkout"}
          </AppText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <AppText variant="h3">Total</AppText>
          <AppText variant="h2" color="brand" weight="800">Rs {subtotal.toLocaleString()}</AppText>
        </View>
        <Button
          title="Proceed to Checkout"
          iconRight="arrow-forward"
          onPress={() => navigation.navigate("Checkout", { cartItems, totalAmount: subtotal })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  list: { padding: space.lg, paddingBottom: 280 },
  row: { flexDirection: "row", alignItems: "center", padding: space.md },
  image: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.bg.sunken },
  rowInfo: { flex: 1, marginLeft: space.md },
  rowBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: space.md },
  removeBtn: {
    position: "absolute", top: space.sm, right: space.sm,
    width: 26, height: 26, borderRadius: radius.pill,
    backgroundColor: colors.bg.sunken, justifyContent: "center", alignItems: "center",
  },
  summary: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: colors.bg.surface,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: space.xl, paddingBottom: 150,
    ...shadows.e4,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm },
  totalRow: { marginTop: space.sm, marginBottom: space.lg, paddingTop: space.md, borderTopWidth: 1, borderTopColor: colors.border.subtle },
});

export default CartScreen;
