import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { colors } from '../Themes/colors';
import { useStripe } from '@stripe/stripe-react-native';
import { apiFetch } from '../../src/apiFetch';
import { InteractionManager } from 'react-native';
import PaymentMethodModal from './PaymentmethodsModel';

const CheckoutScreen = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const navigation = useNavigation();
  const route = useRoute();
  const cartItems = route.params?.cartItems || [];
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharges = subtotal < 200000 ? 5000 : 0;
  const totalAmount = subtotal + shippingCharges;
  const advancePayment = totalAmount * 0.2;

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUserEmail = await AsyncStorage.getItem('email');
      setUserId(storedUserId ? Number(storedUserId) : null);
      setUserEmail(storedUserEmail);
    };
    fetchUserData();
  }, []);

  // 1️⃣ Create payment intent
  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: advancePayment,
          currency: "usd",
          customerEmail: userEmail,
        }),
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

  // 2️⃣ Initialize and present Stripe payment sheet
  const startStripePayment = async () => {
    const paymentIntentClientSecret = clientSecret || await createPaymentIntent();
    if (!paymentIntentClientSecret) return;

    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret,
      merchantDisplayName: "Basit Sanitary",
      style: "automatic",
    });

    if (initError) {
      showMessage(initError.message, "error");
      return;
    }

    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      showMessage(paymentError.message, "error");
    } else {
      showMessage(`Payment of $${advancePayment} was successful!`, "success");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      {message && (
        <View style={[styles.messageBox, { backgroundColor: messageType === "error" ? colors.error : colors.primary }]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={[styles.header, { color: colors.text }]}>All Items</Text>}
        data={cartItems}
        keyExtractor={(item) => item.cart_id.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
            <View style={styles.itemDetails}>
              <View style={styles.itemDetailsleft}>
                <Text style={[styles.itemNo, { color: colors.text }]}>{index + 1}.</Text>
                <Image source={{ uri: item.image_url }} style={[styles.image, { borderColor: colors.border }]} />
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.itemPrice, { color: colors.mutedText }]}>Price: {item.price}</Text>
                  <Text style={[styles.itemQuantity, { color: colors.mutedText }]}>Qty: {item.quantity}</Text>
                </View>
              </View>
              <Text style={[styles.itemTotal, { color: colors.accent }]}>Total: {item.price * item.quantity}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={[styles.priceContainer, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
              <Text style={[styles.priceText, { color: colors.text }]}>Subtotal: {subtotal} Rupees</Text>
              <Text style={[styles.priceText, { color: colors.text }]}>Shipping Charges: {shippingCharges} Rupees</Text>
              <Text style={[styles.totalAmount, { color: colors.accent }]}>Total: {totalAmount} Rupees</Text>
              <Text style={[styles.priceText, { color: colors.text }]}>Advance Payment (20%): {advancePayment} Rupees</Text>
            </View>

            <View style={[styles.paymenttextcontainer, { backgroundColor: colors.text }]}>
              <Text style={[styles.paymentTextdescription, { color: colors.white }]}>
                Customers must pay 20% of the total order amount using mobile payment methods (JazzCash or EasyPaisa) and upload the payment receipt in the user detail form. The remaining 80% is payable upon delivery.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.paymentButton, { backgroundColor: colors.cardsbackground, borderWidth: 1.5, borderColor: colors.primary }]}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={[styles.paymentText, { color: colors.primary }]}>Proceed to Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('UserDetailsScreen', {
                user_id: userId,
                user_email: userEmail,
                subtotal,
                shipping_charges: shippingCharges,
                total_amount: totalAmount,
                advance_payment: advancePayment,
                cart_items: cartItems
              })}
            >
              <Text style={[styles.formButtonText, { color: colors.text }]}>Enter Details and Confirm Order</Text>
            </TouchableOpacity>
          </>
        }
      />

      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onCardPress={() => {
          InteractionManager.runAfterInteractions(() => {
            startStripePayment();
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 15, paddingBottom: 55 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  cartItem: {
    borderRadius: 10, padding: 10, marginBottom: 10, marginHorizontal: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, borderWidth: 1,
  },
  itemTextContainer: { marginHorizontal: 10 },
  itemDetails: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemDetailsleft: { flexDirection: 'row', width: '69%', alignItems: 'center', gap: 5 },
  image: { width: 50, height: 50, borderRadius: 10, borderWidth: 1 },
  itemNo: { fontWeight: 'bold' },
  itemName: { fontWeight: 'bold' },
  itemPrice: { fontSize: 14 },
  itemQuantity: { fontSize: 14 },
  itemTotal: { fontWeight: 'bold', fontSize: 14 },
  priceContainer: { padding: 15, marginHorizontal: 15, borderRadius: 10, marginVertical: 10, borderWidth: 1, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  priceText: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  paymenttextcontainer: { padding: 15, marginHorizontal: 15, borderRadius: 10, marginVertical: 10 },
  paymentTextdescription: { textAlign: 'justify', fontSize: 14 },
  paymentButton: { padding: 15, marginHorizontal: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  paymentText: { fontSize: 16, fontWeight: 'bold' },
  formButton: { marginHorizontal: 15, marginBottom: 20, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  formButtonText: { fontSize: 16, fontWeight: 'bold' },
   messageBox: { padding: 10, borderRadius: 8, marginBottom: 15 },
  messageText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});

export default CheckoutScreen;
