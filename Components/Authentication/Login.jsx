import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();


import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../Themes/colors";
import bgImage from "../../assets/splash1.jpg";
import { apiFetch } from "../../src/apiFetch";
const { EXPO_CLIENT_ID, ANDROID_CLIENT_ID } = Constants.expoConfig.extra;

const LoginScreen = ({ navigation }) => {

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "basitsanitaryapp",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
    redirectUri,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateInputs = () => {
    const emailValid = isValidEmail(email);
    const passValid = password.length >= 8;

    setEmailError(!emailValid);
    setPasswordError(!passValid);

    return emailValid && passValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const res = await apiFetch(`/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Check if login successful
      if (data.userId && data.email && data.accessToken) {
        // Store tokens securely
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);

        // Store user info
        await AsyncStorage.setItem("userId", data.userId.toString());
        await AsyncStorage.setItem("email", data.email);

        // Navigate to your home or splash screen
        navigation.replace("SplashScreen");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (err) {
      Alert.alert("Error", "Login failed");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication.idToken;
      handleGoogleLogin(idToken);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      const res = await apiFetch(`/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data.accessToken) {
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        await AsyncStorage.setItem("userId", data.userId.toString());
        await AsyncStorage.setItem("email", data.email);
        navigation.replace("SplashScreen");
      }
    } catch (err) {
      Alert.alert("Error", "Google login failed");
    }
  };



  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.mutedText}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, emailError && styles.errorInput]}
            keyboardType="email-address"
          />
          {emailError && (
            <Text style={styles.errorText}>Invalid email format</Text>
          )}

          {/* Password */}
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.mutedText}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, styles.passwordInput, passwordError && styles.errorInput]}
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
          {passwordError && (
            <Text style={styles.errorText}>
              Password must be at least 8 characters
            </Text>
          )}

          {/* Login Button */}
          <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
            <LinearGradient
              colors={colors.gradients.mintGlow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}> Sign up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => promptAsync()}
          >
            <Icon name="google" size={22} color={colors.primary} />
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 30,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 5,
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: colors.secondary,
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: { paddingRight: 45 },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 20,
  },
  errorInput: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginLeft: 5,
  },
  buttonWrapper: {
    marginTop: 30,
    borderRadius: 40,
    elevation: 6,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  normalText: {
    color: colors.mutedText,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default LoginScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/FontAwesome";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import { colors } from "../Themes/colors";

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const validateInputs = () => {
//     setEmailError(!isValidEmail(email));
//     setPasswordError(password.length < 8);
//     return isValidEmail(email) && password.length >= 8;
//   };

//   const handleLogin = async () => {
//     if (!validateInputs()) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (data.userId && data.email && data.accessToken && data.refreshToken) {
//         await SecureStore.setItemAsync("accessToken", data.accessToken);
//         await SecureStore.setItemAsync("refreshToken", data.refreshToken);
//         await AsyncStorage.setItem("userId", data.userId.toString());

//         navigation.replace("SplashScreen");
//       } else {
//         Alert.alert("Error", data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       Alert.alert("Error", "Login failed");
//     }
//   };

//   return (
//     <View
//       // colors={colors.gradients.deepTech}
//       style={styles.gradient}
//     >
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>
//             Sign in to continue your smart journey
//           </Text>

//           {/* Email */}
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor={colors.mutedText}
//             value={email}
//             onChangeText={setEmail}
//             style={[styles.input, emailError && styles.errorInput]}
//             keyboardType="email-address"
//           />
//           {emailError && (
//             <Text style={styles.errorText}>Invalid email format</Text>
//           )}

//           {/* Password */}
//           <View style={styles.passwordContainer}>
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor={colors.mutedText}
//               value={password}
//               onChangeText={setPassword}
//               style={[
//                 styles.input,
//                 styles.passwordInput,
//                 passwordError && styles.errorInput,
//               ]}
//               secureTextEntry={!passwordVisible}
//             />
//             <TouchableOpacity
//               style={styles.eyeIcon}
//               onPress={() => setPasswordVisible(!passwordVisible)}
//             >
//               <Icon
//                 name={passwordVisible ? "eye-slash" : "eye"}
//                 size={20}
//                 color={colors.mutedText}
//               />
//             </TouchableOpacity>
//           </View>
//           {passwordError && (
//             <Text style={styles.errorText}>
//               Password must be at least 8 characters
//             </Text>
//           )}

//           {/* Login Button */}
//           <TouchableOpacity
//             onPress={handleLogin}
//             activeOpacity={0.9}
//             style={styles.buttonWrapper}
//           >
//             <LinearGradient
//               colors={colors.gradients.ocean}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.button}
//             >
//               <Text style={styles.buttonText}>Login</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Signup Link */}
//           <View style={styles.signupRow}>
//             <Text style={styles.normalText}>Don’t have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
//               <Text style={styles.link}> Sign up</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Social Buttons */}
//           <View style={styles.buttonsContainer}>
//             <TouchableOpacity style={styles.socialButton}>
//               <Icon name="google" size={22} color={colors.text} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialButton}>
//               <Icon name="facebook" size={22} color={colors.text} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialButton}>
//               <Icon name="apple" size={22} color={colors.text} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor:colors.bodybackground
//   },
//   formContainer: {
//     backgroundColor: colors.cardsbackground,
//     padding: 30,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     shadowColor: colors.primary,
//     shadowOpacity: 0.5,
//     shadowOffset: { width: 0, height: 0 },
//     shadowRadius: 18,
//     elevation: 10,
//     width: "100%",
//     maxWidth: 400,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: colors.text,
//     textAlign: "center",
//     textShadowColor: colors.primary,
//     textShadowRadius: 12,
//     marginBottom: 5,
//   },
//   subtitle: {
//     color: colors.mutedText,
//     textAlign: "center",
//     marginBottom: 20,
//     fontSize: 14,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     padding: 12,
//     marginVertical: 8,
//     borderRadius: 12,
//     backgroundColor: colors.secondary,
//     color: colors.text,
//   },
//   errorInput: {
//     borderColor: "red",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginBottom: 5,
//     marginLeft: 5,
//   },
//   passwordContainer: {
//     position: "relative",
//     width: "100%",
//   },
//   passwordInput: {
//     paddingRight: 45,
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 12,
//     top: 20,
//   },
//   buttonWrapper: {
//     width: "100%",
//     borderRadius: 40,
//     // shadowColor: colors.accent,
//     shadowOpacity: 0.8,
//     shadowRadius: 20,
//     elevation: 8,
//     marginTop: 30,
//   },
//   button: {
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: colors.text,
//     fontSize: 18,
//     fontWeight: "600",
//     letterSpacing: 1,
//   },
//   signupRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 15,
//   },
//   normalText: {
//     color: colors.mutedText,
//     fontSize: 14,
//   },
//   link: {
//     color: colors.primary,
//     fontWeight: "bold",
//     fontSize: 15,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 25,
//     gap: 20,
//   },
//   socialButton: {
//     backgroundColor: colors.secondary,
//     padding: 14,
//     borderRadius: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     width: 55,
//     height: 55,
//     borderWidth: 1,
//     borderColor: colors.border,
//     shadowColor: colors.primary,
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 5,
//   },
// });

// export default LoginScreen;