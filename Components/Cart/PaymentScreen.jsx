import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user_id,user_email, subtotal, shipping_charges, total_amount, advance_payment, cart_items } = route.params || {};
  useEffect(() => {
    console.log("PaymentScreen received data:");
    console.log("User ID:", user_id);
    console.log("Email:", user_email);
    console.log("Subtotal:", subtotal);
    console.log("Shipping Charges:", shipping_charges);
    console.log("Total Amount:", total_amount);
    console.log("Advance Payment (20%):", advance_payment);
    console.log("Cart Items:", cart_items);
  }, []);
  
  const openApp = async (appUrl, fallbackUrl) => {
    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        Alert.alert("App Not Found", `Please install the app or pay through Jazz Cash/Easy Paisa app install in your phone and upload reciept in confirm order form.`);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open the app.");
    }
  };

  const openJazzCash = () => {
    openApp('jazzcash://', 'https://www.jazzcash.com.pk/');
  };

  const openEasyPaisa = () => {
    openApp('easypaisa://', 'https://easypaisa.com.pk/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Payment Method</Text>
      <TouchableOpacity style={styles.paymentButton} onPress={() => navigation.navigate("StripePayment", { advance_payment,user_email })}>
        <Text style={styles.paymentText}>Credit / Debit Cards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.paymentButton} onPress={openJazzCash}>
        <Text style={styles.paymentText}>Pay with JazzCash</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.paymentButton} onPress={openEasyPaisa}>
        <Text style={styles.paymentText}>Pay with EasyPaisa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },

  paymentButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', marginBottom: 10 },
  paymentText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  backButton: { backgroundColor: '#000', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', marginTop: 20 },
  backText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default PaymentScreen;
