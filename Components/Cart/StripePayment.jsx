import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import valid from "card-validator";
import { apiFetch } from "../../src/apiFetch";
import { colors } from "../Themes/colors";

const StripePayment = ({ route }) => {
  const { advance_payment, user_email } = route.params || {};
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [cardType, setCardType] = useState(null);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const cardIcons = {
    visa: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" },
    mastercard: { uri: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    "american-express": { uri: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" },
    discover: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/50/Discover_Card_logo.svg" },
  };

  const detectCardType = (number) => {
    const cardInfo = valid.number(number.replace(/\s/g, ""));
    setCardType(cardInfo.card ? cardInfo.card.type : null);
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    if (formatted.length <= 19) {
      setCardNumber(formatted);
      detectCardType(formatted);
    }
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 4) return;

    const formatted = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    setExpiry(formatted);
  };

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: advance_payment,
          currency: "usd",
          customerEmail: user_email,
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      showMessage("Payment initialized!", "success");
      return clientSecret;
    } catch (error) {
      showMessage("Failed to create payment intent.", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvc || !zip) {
      showMessage("Please fill all fields.", "error");
      return;
    }

    const paymentIntentClientSecret = clientSecret || (await createPaymentIntent());
    if (!paymentIntentClientSecret) return;

    const { error: sheetError } = await initPaymentSheet({
      paymentIntentClientSecret,
      merchantDisplayName: "Basit Sanitary", // ✅ FIXES THE ERROR
      style: "automatic",
    });

    if (sheetError) {
      showMessage(sheetError.message, "error");
      return;
    }

    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      showMessage(paymentError.message, "error");
    } else {
      showMessage(`Payment of $${advance_payment} was successful!`, "success");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      {message && (
        <View
          style={[
            styles.messageBox,
            { backgroundColor: messageType === "error" ? colors.error : colors.primary },
          ]}
        >
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <Text style={[styles.title, { color: colors.text }]}>Enter Card Details</Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Card Number</Text>

        <View style={styles.cardnumbercontainer}>
          <View
            style={[
              styles.cardInputWrapper,
              { backgroundColor: colors.cardsbackground, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.cardInput, { color: colors.text }]}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.mutedText}
              keyboardType="numeric"
              maxLength={19}
              value={cardNumber}
              onChangeText={formatCardNumber}
            />
            <View style={styles.cardIconWrapper}>
              {cardType && cardIcons[cardType] && (
                <Image source={cardIcons[cardType]} style={styles.cardIcon} resizeMode="contain" />
              )}
            </View>
          </View>

          <View style={styles.cardImagesContainer}>
            {[require("../../assets/visa.png"), require("../../assets/mastercard.png"), require("../../assets/american-express.png")].map(
              (img, index) => (
                <Image key={index} source={img} style={styles.cardSmallIcon} resizeMode="contain" />
              )
            )}
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainerSmall}>
          <Text style={[styles.label, { color: colors.mutedText }]}>Expiry Date</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="MM/YY"
            placeholderTextColor={colors.mutedText}
            keyboardType="numeric"
            maxLength={5}
            value={expiry}
            onChangeText={formatExpiry}
          />
        </View>

        <View style={styles.inputContainerSmall}>
          <Text style={[styles.label, { color: colors.mutedText }]}>CVC</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="123"
            placeholderTextColor={colors.mutedText}
            keyboardType="numeric"
            maxLength={3}
            value={cvc}
            onChangeText={setCvc}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.mutedText }]}>ZIP Code</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="12345"
          placeholderTextColor={colors.mutedText}
          keyboardType="numeric"
          maxLength={5}
          value={zip}
          onChangeText={setZip}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: colors.primary }]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.white }]}>Pay: ${advance_payment}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1, fontSize: 16 },
  cardInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  cardInput: { width: "60%", fontSize: 16, padding: 12 },
  cardIconWrapper: { width: "30%", alignItems: "flex-end" },
  cardIcon: { width: 40, height: 25 },
  cardImagesContainer: { flexDirection: "row", marginTop: 10 },
  cardSmallIcon: { width: 60, height: 40, marginRight: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputContainerSmall: { width: "48%" },
  payButton: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { fontSize: 18, fontWeight: "bold" },
  messageBox: { padding: 10, borderRadius: 8, marginBottom: 15 },
  messageText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});

export default StripePayment;
