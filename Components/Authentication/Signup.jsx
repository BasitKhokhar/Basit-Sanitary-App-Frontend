
// import React, { useState } from "react";
// import { LinearGradient } from "expo-linear-gradient";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ImageBackground,
// } from "react-native";
// import Constants from 'expo-constants';
// import { apiFetch } from "../../src/apiFetch";
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// import Icon from "react-native-vector-icons/FontAwesome";
// import { colors } from "../Themes/colors";
// import bgImage from "../../assets/splash1.jpg";

// const SignupScreen = ({ navigation }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [city, setCity] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const isValidPhone = (phone) => /^\d{11}$/.test(phone);

//   const validateInputs = () => {
//     if (!name || !email || !password || !phone || !city) {
//       Alert.alert("Error", "All fields are required!");
//       return false;
//     }
//     if (!isValidEmail(email)) {
//       Alert.alert("Error", "Invalid email format!");
//       return false;
//     }
//     if (!isValidPhone(phone)) {
//       Alert.alert("Error", "Phone number must be exactly 11 digits!");
//       return false;
//     }
//     if (password.length < 8) {
//       Alert.alert("Error", "Password must be at least 8 characters long!");
//       return false;
//     }
//     return true;
//   };

//  const handleSignup = () => {
//     if (!validateInputs()) return;
//     apiFetch(`/auth/signup`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, password, phone }),
//     })
//       .then((res) => res.json())
//       .then(() => {
//         Alert.alert("Success", "Signup successful! Please log in.");
//         navigation.navigate("Login");
//       })
//       .catch(() => Alert.alert("Error", "Signup failed"));
//   };

//   return (
//     <ImageBackground source={bgImage} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Sign Up</Text>

//           <TextInput
//             placeholder="Name"
//             value={name}
//             onChangeText={setName}
//             style={styles.input}
//             placeholderTextColor={colors.mutedText}
//           />
//           <TextInput
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             style={styles.input}
//             keyboardType="email-address"
//             placeholderTextColor={colors.mutedText}
//           />

//           {/* Password with toggle */}
//           <View style={styles.passwordWrapper}>
//             <TextInput
//               placeholder="Password"
//               value={password}
//               onChangeText={setPassword}
//               style={[styles.input, styles.passwordInput]}
//               placeholderTextColor={colors.mutedText}
//               secureTextEntry={!passwordVisible}
//             />
//             <TouchableOpacity
//               onPress={() => setPasswordVisible(!passwordVisible)}
//               style={styles.eyeIcon}
//             >
//               <Icon
//                 name={passwordVisible ? "eye-slash" : "eye"}
//                 size={20}
//                 color={colors.secondary}
//               />
//             </TouchableOpacity>
//           </View>

//           <TextInput
//             placeholder="Phone"
//             value={phone}
//             onChangeText={setPhone}
//             style={styles.input}
//             keyboardType="phone-pad"
//             placeholderTextColor={colors.mutedText}
//           />
//           <TouchableOpacity style={styles.buttonWrapper} onPress={handleSignup}>
//             <LinearGradient
//               colors={colors.gradients.mintGlow}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.button}
//             >
//               <Text style={styles.buttonText}>Sign Up</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           <View style={styles.signupRow}>
//             <Text style={styles.normalText}>Already have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//               <Text style={styles.link}> Login</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: { flex: 1, resizeMode: "cover", justifyContent: "center" },
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   formContainer: {
//     backgroundColor: "rgba(0,0,0,0.8)",
//     padding: 25,
//     borderRadius: 12,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 6,
//     width: "100%",
//     maxWidth: 400,
//   },
//   title: { fontSize: 26, fontWeight: "bold", color: colors.secondary, marginBottom: 20, textAlign: "center" },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.border || "#555",
//     padding: 12,
//     marginVertical: 8,
//     borderRadius: 8,
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     color: colors.secondary,
//   },
//   passwordWrapper: { position: "relative" },
//   passwordInput: { paddingRight: 45 },
//   eyeIcon: { position: "absolute", right: 12, top: 20 },
//   buttonWrapper: { marginTop: 10, borderRadius: 40, elevation: 6 },
//   button: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
//   buttonText: { color: colors.text, fontSize: 16, fontWeight: "bold" },
//   signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
//   normalText: { color: colors.mutedText, fontSize: 14 },
//   link: { color: colors.primary, fontWeight: "bold", fontSize: 15 },
// });

// export default SignupScreen;
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import Constants from 'expo-constants';
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../Themes/colors";
import bgImage from "../../assets/splash1.jpg";
import { apiFetch } from "../../src/apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [showLoader, setShowLoader] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const validateInputs = () => {
    if (!name || !email || !password || !phone) {
      showToastMessage("All fields are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      showToastMessage("Invalid email format!");
      return false;
    }
    if (!isValidPhone(phone)) {
      showToastMessage("Phone number must be exactly 11 digits!");
      return false;
    }
    if (password.length < 8) {
      showToastMessage("Password must be at least 8 characters long!");
      return false;
    }
    return true;
  };

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      setShowLoader(true);
      const response = await apiFetch(
        `/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone }),
        },
        navigation
      );

      setShowLoader(false);

      if (response.ok) {
        showToastMessage("Signup successful! Redirecting...");
        setTimeout(() => navigation.navigate("Login"), 2000);
      } else {
        const data = await response.json();
        showToastMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setShowLoader(false);
      showToastMessage("Signup failed: " + error.message);
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={colors.mutedText}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor={colors.mutedText}
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, styles.passwordInput]}
              placeholderTextColor={colors.mutedText}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Icon
                name={passwordVisible ? "eye-slash" : "eye"}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor={colors.mutedText}
          />

          <TouchableOpacity style={styles.buttonWrapper} onPress={handleSignup}>
            <LinearGradient
              colors={colors.gradients.mintGlow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 🔄 Loader Modal */}
      <AnimatePresence>
        {showLoader && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
          >
            <View style={[styles.loaderBox, { backgroundColor: colors.cardsbackground }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loaderText}>Please wait...</Text>
            </View>
          </MotiView>
        )}
      </AnimatePresence>

      {/* ✅ Toast Modal */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={styles.overlay}
          >
            <View style={[styles.toastBox, { backgroundColor: colors.cardsbackground }]}>
              <View style={[styles.iconWrapper, { backgroundColor: "rgba(6,182,212,0.15)" }]}>
                <Ionicons
                  name={
                    toastMessage.toLowerCase().includes("fail") ||
                    toastMessage.toLowerCase().includes("error")
                      ? "close-circle"
                      : "checkmark-circle"
                  }
                  size={60}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.toastTitle}>Notice</Text>
              <Text style={styles.toastMessage}>{toastMessage}</Text>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  formContainer: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 25,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: "100%",
    maxWidth: 400,
  },
  title: { fontSize: 26, fontWeight: "bold", color: colors.secondary, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: colors.border || "#555",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: colors.secondary,
  },
  passwordWrapper: { position: "relative" },
  passwordInput: { paddingRight: 45 },
  eyeIcon: { position: "absolute", right: 12, top: 20 },
  buttonWrapper: { marginTop: 10, borderRadius: 40, elevation: 6 },
  button: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  normalText: { color: colors.mutedText, fontSize: 14 },
  link: { color: colors.primary, fontWeight: "bold", fontSize: 15 },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loaderBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  loaderText: { color: colors.text, marginTop: 10 },
  toastBox: {
    width: "75%",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconWrapper: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  toastTitle: { color: colors.text, fontSize: 20, fontWeight: "700", marginBottom: 6 },
  toastMessage: { color: colors.mutedText, fontSize: 14, textAlign: "center", lineHeight: 20 },
});

export default SignupScreen;
