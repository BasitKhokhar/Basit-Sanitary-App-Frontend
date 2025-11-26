
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Constants from 'expo-constants';
import { apiFetch } from "../../src/apiFetch";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../Themes/colors";
import bgImage from "../../assets/splash1.jpg";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const validateInputs = () => {
    if (!name || !email || !password || !phone || !city) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Invalid email format!");
      return false;
    }
    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Phone number must be exactly 11 digits!");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long!");
      return false;
    }
    return true;
  };

 const handleSignup = () => {
    if (!validateInputs()) return;
    apiFetch(`/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, city }),
    })
      .then((res) => res.json())
      .then(() => {
        Alert.alert("Success", "Signup successful! Please log in.");
        navigation.navigate("Login");
      })
      .catch(() => Alert.alert("Error", "Signup failed"));
  };

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <View style={styles.container}>
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

          {/* Password with toggle */}
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
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            style={styles.input}
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
      </View>
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
});

export default SignupScreen;
