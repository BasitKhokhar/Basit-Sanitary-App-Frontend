// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
//   Image
// } from "react-native";
// import { useStripe } from "@stripe/stripe-react-native";
// import valid from "card-validator";
// import Paymentcardimages from "./paymentcardsimages";
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// const StripePayment = ({ route }) => {
//   const { advance_payment, user_email } = route.params || {};
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const [loading, setLoading] = useState(false);
//   const [clientSecret, setClientSecret] = useState(null);
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvc, setCvc] = useState("");
//   const [zip, setZip] = useState("");
//   const [cardType, setCardType] = useState(null);

//   const cardIcons = {
//     visa: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" },
//     mastercard: { uri: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
//     "american-express": { uri: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" },
//     discover: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/50/Discover_Card_logo.svg" },
//   };

//   const detectCardType = (number) => {
//     const cardInfo = valid.number(number.replace(/\s/g, ""));
//     if (cardInfo.card) {
//       setCardType(cardInfo.card.type); // This should now match keys in `cardIcons`
//     } else {
//       setCardType(null);
//     }
//   };

//   const formatCardNumber = (text) => {
//     const cleaned = text.replace(/\D/g, "");
//     let formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
//     if (formatted.length > 19) formatted = formatted.slice(0, 19);
//     setCardNumber(formatted);
//     detectCardType(formatted);
//   };

//   const formatExpiry = (text) => {
//     const cleaned = text.replace(/\D/g, ""); // Remove non-numeric characters
//     if (cleaned.length > 4) return;
  
//     let formatted = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    
//     if (formatted.length === 5) {
//       const [month, year] = formatted.split("/").map(Number);
  
//       const currentDate = new Date();
//       const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
//       const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the year
  
//       if (month < 1 || month > 12) {
//         Alert.alert("Invalid Expiry Date", "Month must be between 01 and 12.");
//         return;
//       }
  
//       if (year < currentYear || (year === currentYear && month < currentMonth)) {
//         Alert.alert("Invalid Expiry Date", "Card expiry date must be in the future.");
//         return;
//       }
//     }
  
//     setExpiry(formatted);
//   };
  

//   const createPaymentIntent = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: advance_payment,
//           currency: "usd",
//           customerEmail: user_email,
//         }),
//       });

//       const { clientSecret } = await response.json();
//       console.log("clientsecret coming from stripe APi",clientSecret)
//       setClientSecret(clientSecret);
//       alert("Your payment is Successfully Done");
//     } catch (error) {
//       Alert.alert("Error", "Failed to create payment intent");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (!cardNumber || !expiry || !cvc || !zip) {
//       Alert.alert("Missing Information", "Please fill in all the fields before proceeding.");
//       return;
//     }
//     const paymentIntentClientSecret = clientSecret || (await createPaymentIntent());
//     if (!paymentIntentClientSecret) return;

//     const { error } = await initPaymentSheet({ paymentIntentClientSecret });

//     if (!error) {
//       const { error: paymentError } = await presentPaymentSheet();
//       if (paymentError) {
//         Alert.alert("Payment Failed", paymentError.message);
//       } else {
//         Alert.alert("Success", `Your payment of $${advance_payment} was successful!`);
//       }
//     } else {
//       Alert.alert("Error", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Enter Card Details</Text>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Card Number</Text>
//         <View style={styles.cardnumbercontainer}>
//           <View style={styles.cardInputWrapper}>
//             <TextInput
//               style={styles.cardInput}
//               placeholder="1234 5678 9012 3456"
//               keyboardType="numeric"
//               maxLength={19}
//               value={cardNumber}
//               onChangeText={formatCardNumber}
//             />
//             <View style={styles.cardIconWrapper}>
//               {cardType && cardIcons[cardType] && (
//                 <Image source={cardIcons[cardType]} style={styles.cardIcon} resizeMode="contain" />
//               )}
//             </View>
//           </View>
//           <Paymentcardimages/>
//           <View>
//             {/* <Image
//               source={require('assets\visa.png')}  // Path to your local image
//               style={{ width: 100, height: 100 }}
//             /> */}
//           </View>
//         </View>

//       </View>

//       <View style={styles.row}>
//         <View style={styles.inputContainerSmall}>
//           <Text style={styles.label}>Expiry Date</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="MM/YY"
//             keyboardType="numeric"
//             maxLength={5}
//             value={expiry}
//             onChangeText={formatExpiry}
//           />
//         </View>

//         <View style={styles.inputContainerSmall}>
//           <Text style={styles.label}>CVC</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="123"
//             keyboardType="numeric"
//             maxLength={3}
//             value={cvc}
//             onChangeText={setCvc}
//           />
//         </View>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>ZIP Code</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="12345"
//           keyboardType="numeric"
//           maxLength={5}
//           value={zip}
//           onChangeText={setZip}
//         />
//       </View>

//       <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text style={styles.buttonText}>Pay: {advance_payment}</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8f9fa" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
//   inputContainer: { marginBottom: 15 },
//   label: { fontSize: 16, color: "#555", marginBottom: 5 },
//   input: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     fontSize: 16,
//   },
//   cardInputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     paddingHorizontal: 12,
//     justifyContent: "space-between",
//   },
//   cardInput: {
//     width: "60%",  // Ensures input takes 60% width
//     fontSize: 16,
//     padding: 12,
//   },
//   cardIconWrapper: {
//     width: "30%",  // Ensures icon stays in the remaining space
//     alignItems: "flex-end",
//   },
//   cardIcon: {
//     width: 40,
//     height: 25,
//   },
//   row: { flexDirection: "row", justifyContent: "space-between" },
//   inputContainerSmall: { width: "48%" },
//   payButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
//   buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
// });

// export default StripePayment;
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import valid from "card-validator";
import Paymentcardimages from "./paymentcardsimages";
import Constants from 'expo-constants';
import { colors } from "../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

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
    let formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    if (formatted.length > 19) formatted = formatted.slice(0, 19);
    setCardNumber(formatted);
    detectCardType(formatted);
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 4) return;
    let formatted = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    setExpiry(formatted);
  };

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: advance_payment, currency: "usd", customerEmail: user_email }),
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      return clientSecret;
    } catch (error) {
      Alert.alert("Error", "Failed to create payment intent");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvc || !zip) {
      Alert.alert("Missing Information", "Please fill in all the fields before proceeding.");
      return;
    }

    const paymentIntentClientSecret = clientSecret || (await createPaymentIntent());
    if (!paymentIntentClientSecret) return;

    const { error } = await initPaymentSheet({ paymentIntentClientSecret });
    if (!error) {
      const { error: paymentError } = await presentPaymentSheet();
      if (paymentError) Alert.alert("Payment Failed", paymentError.message);
      else Alert.alert("Success", `Your payment of $${advance_payment} was successful!`);
    } else {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Text style={[styles.title, { color: colors.text }]}>Enter Card Details</Text>

      {/* Card Number */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Card Number</Text>
        <View style={[styles.cardInputWrapper, { borderColor: colors.border }]}>
          <TextInput
            style={styles.cardInput}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
            value={cardNumber}
            onChangeText={formatCardNumber}
            placeholderTextColor={colors.mutedText}
          />
          {cardType && cardIcons[cardType] && (
            <Image source={cardIcons[cardType]} style={styles.cardIcon} resizeMode="contain" />
          )}
        </View>
      </View>

      <Paymentcardimages />

      {/* Expiry and CVC */}
      <View style={styles.row}>
        <View style={styles.inputGroupSmall}>
          <Text style={[styles.label, { color: colors.text }]}>Expiry Date</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border }]}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            value={expiry}
            onChangeText={formatExpiry}
            placeholderTextColor={colors.mutedText}
          />
        </View>
        <View style={styles.inputGroupSmall}>
          <Text style={[styles.label, { color: colors.text }]}>CVC</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border }]}
            placeholder="123"
            keyboardType="numeric"
            maxLength={3}
            value={cvc}
            onChangeText={setCvc}
            placeholderTextColor={colors.mutedText}
          />
        </View>
      </View>

      {/* ZIP */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>ZIP Code</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border }]}
          placeholder="12345"
          keyboardType="numeric"
          maxLength={5}
          value={zip}
          onChangeText={setZip}
          placeholderTextColor={colors.mutedText}
        />
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: colors.primary }]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.white }]}>Pay: {advance_payment}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  inputGroup: { marginBottom: 15 },
  inputGroupSmall: { width: "48%" },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    backgroundColor: colors.cardsbackground,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  cardInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardsbackground,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  cardInput: { width: "70%", fontSize: 16, paddingVertical: 12 },
  cardIcon: { width: 40, height: 25 },
  payButton: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});

export default StripePayment;
