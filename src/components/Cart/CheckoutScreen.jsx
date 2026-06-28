import React, { useState, useEffect } from "react";
import { View, FlatList, Image, StyleSheet, InteractionManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { apiFetch } from "../../apiFetch";
import PaymentMethodModal from "./PaymentmethodsModel";

import AppText from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";

const TRUST = [
  { icon: "verified-user", label: "Secure payment" },
  { icon: "local-shipping", label: "Fast delivery" },
  { icon: "replay", label: "Easy returns" },
];

const CheckoutScreen = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const navigation = useNavigation();
  const route = useRoute();
  const cartItems = route.params?.cartItems || [];
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharges = subtotal < 200000 ? 5000 : 0;
  const totalAmount = subtotal + shippingCharges;
  const advancePayment = totalAmount * 0.2;

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    (async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedUserEmail = await AsyncStorage.getItem("email");
      setUserId(storedUserId ? Number(storedUserId) : null);
      setUserEmail(storedUserEmail);
    })();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/payments/create-payment-intent`, {
        method: "POST",
        body: JSON.stringify({ amount: advancePayment, currency: "usd", customerEmail: userEmail }),
      });
      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error("Client secret not received");
      setClientSecret(clientSecret);
      return clientSecret;
    } catch (error) {
      showMessage("Failed to initialize payment", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startStripePayment = async () => {
    const paymentIntentClientSecret = clientSecret || (await createPaymentIntent());
    if (!paymentIntentClientSecret) return;

    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret,
      merchantDisplayName: "Basit Sanitary",
      style: "automatic",
    });
    if (initError) return showMessage(initError.message, "error");

    const { error: paymentError } = await presentPaymentSheet();
    if (paymentError) showMessage(paymentError.message, "error");
    else showMessage(`Payment of $${advancePayment} was successful!`, "success");
  };

  const Row = ({ label, value, strong, accent }) => (
    <View style={styles.priceRow}>
      <AppText variant={strong ? "h3" : "body"} color={strong ? "primary" : "secondary"}>{label}</AppText>
      <AppText variant={strong ? "h3" : "bodyLg"} weight={strong ? "800" : "700"} color={accent ? "brand" : "primary"}>
        Rs {Number(value).toLocaleString()}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      {message && (
        <View style={[styles.messageBox, { backgroundColor: messageType === "error" ? colors.status.error : colors.brand.primary }]}>
          <AppText variant="label" color="onPrimary" weight="700" align="center">{message}</AppText>
        </View>
      )}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={cartItems}
        keyExtractor={(item) => String(item.cart_id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
           
            <View style={styles.trustRow}>
              {TRUST.map((t) => (
                <View key={t.label} style={styles.trustItem}>
                  <Icon name={t.icon} size={20} color={colors.brand.primary} />
                  <AppText variant="micro" color="secondary" weight="600" align="center" style={{ marginTop: 4 }}>{t.label}</AppText>
                </View>
              ))}
            </View>
            <AppText variant="label" color="secondary" style={{ marginBottom: space.sm }}>
              Order items ({cartItems.length})
            </AppText>
          </>
        }
        ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
        renderItem={({ item, index }) => (
          <Card style={styles.item} padded={false}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: space.md }}>
              <AppText variant="label" weight="700" numberOfLines={1}>{item.name}</AppText>
              <AppText variant="caption" color="muted">Qty: {item.quantity} · Rs {Number(item.price).toLocaleString()}</AppText>
            </View>
            <AppText variant="bodyLg" weight="800" color="brand">
              Rs {(item.price * item.quantity).toLocaleString()}
            </AppText>
          </Card>
        )}
        ListFooterComponent={
          <>
            <Card style={{ marginTop: space.lg }}>
              <Row label="Subtotal" value={subtotal} />
              <Row label="Shipping" value={shippingCharges} />
              <View style={styles.divider} />
              <Row label="Total" value={totalAmount} strong accent />
              <View style={styles.advanceBox}>
                <Icon name="info-outline" size={18} color={colors.status.warning} />
                <AppText variant="caption" color="secondary" style={{ flex: 1, marginLeft: space.sm }}>
                  Advance payment (20%): <AppText variant="caption" weight="800" color="primary">Rs {advancePayment.toLocaleString()}</AppText>. Remaining 80% on delivery.
                </AppText>
              </View>
            </Card>

            <Card style={{ marginTop: space.lg, backgroundColor: colors.bg.inverse }}>
              <AppText variant="caption" style={{ color: colors.text.inverse, lineHeight: 18 }}>
                Pay 20% of the total now via JazzCash or EasyPaisa and upload the receipt in the next step. The remaining 80% is payable on delivery.
              </AppText>
            </Card>

            <Button
              title="Proceed to Payment"
              variant="ghost"
              loading={loading}
              onPress={() => setShowPaymentModal(true)}
              style={{ marginTop: space.lg }}
            />
            <Button
              title="Enter Details & Confirm Order"
              iconRight="arrow-forward"
              onPress={() =>
                navigation.navigate("UserDetailsScreen", {
                  user_id: userId,
                  user_email: userEmail,
                  subtotal,
                  shipping_charges: shippingCharges,
                  total_amount: totalAmount,
                  advance_payment: advancePayment,
                  cart_items: cartItems,
                })
              }
              style={{ marginTop: space.md }}
            />
          </>
        }
      />

      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onCardPress={() => InteractionManager.runAfterInteractions(() => startStripePayment())}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  list: { padding: space.lg, paddingBottom: 130 },
  trustRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: space.xl },
  trustItem: {
    flex: 1, alignItems: "center", marginHorizontal: space.xs,
    backgroundColor: colors.bg.surface, paddingVertical: space.md, borderRadius: radius.md,
  },
  item: { flexDirection: "row", alignItems: "center", padding: space.md },
  image: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.bg.sunken },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm },
  divider: { height: 1, backgroundColor: colors.border.subtle, marginVertical: space.sm },
  advanceBox: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: colors.accent.soft, padding: space.md,
    borderRadius: radius.md, marginTop: space.md,
  },
  messageBox: { padding: space.md, borderRadius: radius.md, margin: space.lg, marginBottom: 0 },
});

export default CheckoutScreen;
