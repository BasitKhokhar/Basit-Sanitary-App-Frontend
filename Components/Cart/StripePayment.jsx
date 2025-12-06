
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

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    if (formatted.length <= 19) {
      setCardNumber(formatted);
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
      merchantDisplayName: "Basit Sanitary",
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
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border }]}
          placeholder="2424 2424 2424 2424"
          placeholderTextColor={colors.mutedText}
          keyboardType="numeric"
          maxLength={19}
          value={cardNumber}
          onChangeText={formatCardNumber}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainerSmall}>
          <Text style={[styles.label, { color: colors.mutedText }]}>Expiry Date</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border }]}
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
            style={[styles.input, { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border }]}
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
          style={[styles.input, { backgroundColor: colors.cardsbackground, color: colors.text, borderColor: colors.border }]}
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
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputContainerSmall: { width: "48%" },
  payButton: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { fontSize: 18, fontWeight: "bold" },
  messageBox: { padding: 10, borderRadius: 8, marginBottom: 15 },
  messageText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});

export default StripePayment;
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import { useStripe } from "@stripe/stripe-react-native";
// import { apiFetch } from "../../src/apiFetch";
// import { colors } from "../Themes/colors";

// const StripePayment = ({ route }) => {
//   const { advance_payment, user_email } = route.params || {};
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [messageType, setMessageType] = useState("error");

//   const showMessage = (msg, type = "error") => {
//     setMessage(msg);
//     setMessageType(type);
//     setTimeout(() => setMessage(null), 3000);
//   };

//   const startPayment = async () => {
//     try {
//       setLoading(true);

//       // 1. Create payment intent
//       const response = await apiFetch(`/payments/create-payment-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: advance_payment,
//           currency: "usd",
//           customerEmail: user_email,
//         }),
//       });

//       const { clientSecret } = await response.json();
//       if (!clientSecret) {
//         showMessage("Failed to initialize payment.", "error");
//         return;
//       }

//       // 2. Initialize Payment Sheet
//       const { error: initError } = await initPaymentSheet({
//         merchantDisplayName: "Basit Sanitary",
//         paymentIntentClientSecret: clientSecret,
//         allowsDelayedPaymentMethods: false,
//       });

//       if (initError) {
//         showMessage(initError.message, "error");
//         return;
//       }

//       // 3. Present Payment Sheet
//       const { error: paymentError } = await presentPaymentSheet();

//       if (paymentError) {
//         showMessage(paymentError.message, "error");
//         return;
//       }

//       showMessage(`Payment of $${advance_payment} successful!`, "success");
//     } catch (e) {
//       showMessage("Payment failed. Try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>

//       {message && (
//         <View
//           style={[
//             styles.messageBox,
//             { backgroundColor: messageType === "error" ? colors.error : colors.primary },
//           ]}
//         >
//           <Text style={styles.messageText}>{message}</Text>
//         </View>
//       )}

//       <Text style={[styles.title, { color: colors.text }]}>
//         Pay with Card
//       </Text>

//       <TouchableOpacity
//         style={[styles.payButton, { backgroundColor: colors.primary }]}
//         onPress={startPayment}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color={colors.white} />
//         ) : (
//           <Text style={[styles.buttonText, { color: colors.white }]}>
//             Pay ${advance_payment}
//           </Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 40 },
//   payButton: { padding: 18, borderRadius: 10, alignItems: "center" },
//   buttonText: { fontSize: 18, fontWeight: "bold" },
//   messageBox: { padding: 12, borderRadius: 8, marginBottom: 20 },
//   messageText: { color: "#fff", textAlign: "center", fontWeight: "600" },
// });

// export default StripePayment;
