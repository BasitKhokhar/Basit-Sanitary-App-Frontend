import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { MotiView, AnimatePresence } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";
import bgImage from "../../../assets/splash1.jpg";
import { apiFetch } from "../../apiFetch";

const { palette } = colors;
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SignupScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(null);

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

  const isError =
    toastMessage.toLowerCase().includes("fail") ||
    toastMessage.toLowerCase().includes("error") ||
    toastMessage.toLowerCase().includes("required") ||
    toastMessage.toLowerCase().includes("invalid") ||
    toastMessage.toLowerCase().includes("must");

  return (
    <ImageBackground source={bgImage} style={styles.bg}>
      <LinearGradient
        colors={["rgba(7,53,31,0.55)", "rgba(12,26,20,0.88)", palette.ink]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + space["2xl"], paddingBottom: Math.max(insets.bottom, space.lg) + space["2xl"] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={styles.brand}
          >
            <LinearGradient
              colors={colors.gradients.emeraldGlow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.brandBadge}
            >
              <Ionicons name="water" size={28} color={palette.white} />
            </LinearGradient>
            <Text style={styles.eyebrow}>JOIN US</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 28 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 16, stiffness: 160, delay: 120 }}
            style={styles.card}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start shopping premium sanitary</Text>

            <View style={[styles.field, focused === "name" && styles.fieldFocused]}>
              <Ionicons name="person-outline" size={18} color={palette.emerald200} style={styles.fieldIcon} />
              <TextInput
                placeholder="Full name"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                style={styles.input}
                placeholderTextColor={palette.slate500}
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                textContentType="none"
              />
            </View>

            <View style={[styles.field, focused === "email" && styles.fieldFocused]}>
              <Ionicons name="mail-outline" size={18} color={palette.emerald200} style={styles.fieldIcon} />
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                textContentType="none"
                placeholderTextColor={palette.slate500}
              />
            </View>

            <View style={[styles.field, focused === "password" && styles.fieldFocused]}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.emerald200} style={styles.fieldIcon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                style={styles.input}
                placeholderTextColor={palette.slate500}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                textContentType="none"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={palette.slate300}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.field, focused === "phone" && styles.fieldFocused]}>
              <Ionicons name="call-outline" size={18} color={palette.emerald200} style={styles.fieldIcon} />
              <TextInput
                placeholder="Phone (11 digits)"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                style={styles.input}
                keyboardType="phone-pad"
                placeholderTextColor={palette.slate500}
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                textContentType="none"
              />
            </View>

            <TouchableOpacity style={styles.ctaWrapper} onPress={handleSignup} activeOpacity={0.9}>
              <LinearGradient
                colors={colors.gradients.emeraldGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={18} color={palette.white} />
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color={palette.emerald400} />
              <Text style={styles.loaderText}>Please wait…</Text>
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
            <View style={styles.toastBox}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: isError ? "rgba(224,65,58,0.15)" : "rgba(63,182,131,0.15)" },
                ]}
              >
                <Ionicons
                  name={isError ? "close-circle" : "checkmark-circle"}
                  size={56}
                  color={isError ? palette.red : palette.emerald400}
                />
              </View>
              <Text style={styles.toastTitle}>{isError ? "Oops" : "Success"}</Text>
              <Text style={styles.toastMessage}>{toastMessage}</Text>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: palette.ink },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: space.xl,
  },
  brand: {
    alignItems: "center",
    marginBottom: space.xl,
  },
  brandBadge: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
    ...shadows.brand,
  },
  eyebrow: {
    ...typography.label,
    color: palette.gold,
    letterSpacing: 2.4,
  },
  card: {
    backgroundColor: "rgba(22,38,30,0.72)",
    borderRadius: radius.xl,
    padding: space["2xl"],
    borderWidth: 1,
    borderColor: "rgba(155,217,191,0.16)",
    ...shadows.e4,
  },
  title: {
    ...typography.h1,
    color: palette.white,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: palette.slate300,
    textAlign: "center",
    marginTop: space.xs,
    marginBottom: space.lg,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: space.md,
    height: 54,
    marginTop: space.md,
  },
  fieldFocused: {
    borderColor: palette.emerald400,
    backgroundColor: "rgba(63,182,131,0.10)",
  },
  fieldIcon: { marginRight: space.sm },
  input: {
    flex: 1,
    ...typography.bodyLg,
    color: palette.white,
    paddingVertical: 0,
  },
  ctaWrapper: {
    marginTop: space.xl,
    borderRadius: radius.pill,
    ...shadows.brand,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: space.lg,
    borderRadius: radius.pill,
  },
  ctaText: {
    ...typography.h3,
    color: palette.white,
    letterSpacing: 0.4,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: space["2xl"],
  },
  normalText: {
    ...typography.body,
    color: palette.slate300,
  },
  link: {
    ...typography.body,
    fontWeight: "700",
    color: palette.emerald400,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loaderBox: {
    width: 150,
    height: 150,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.surface,
    ...shadows.e4,
  },
  loaderText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: space.md,
  },
  toastBox: {
    width: "78%",
    maxWidth: 320,
    borderRadius: radius.xl,
    alignItems: "center",
    paddingVertical: space["2xl"],
    paddingHorizontal: space.lg,
    backgroundColor: colors.bg.surface,
    ...shadows.e4,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
  toastTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: space.xs,
  },
  toastMessage: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: "center",
  },
});

export default SignupScreen;
