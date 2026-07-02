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
  ScrollView,
  ImageBackground,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import FAIcon from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";
import bgImage from "../../../assets/splash1.jpg";
import { apiFetch } from "../../apiFetch";

const { palette } = colors;
const { EXPO_CLIENT_ID, ANDROID_CLIENT_ID } = Constants.expoConfig.extra;

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "basitsanitaryapp",
    preferLocalhost: true,
  });
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    redirectUri,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await apiFetch(`/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.userId && data.email && data.accessToken) {
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);

        await AsyncStorage.setItem("userId", data.userId.toString());
        await AsyncStorage.setItem("email", data.email);

        navigation.replace("SplashScreen");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (err) {
      Alert.alert("Error", "Login failed");
      if (__DEV__) console.error("Login error:", err);
    } finally {
      setLoading(false);
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
    <ImageBackground source={bgImage} style={styles.bg}>
      {/* Premium dark scrim for depth + legibility */}
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
            { paddingTop: insets.top + space["3xl"], paddingBottom: Math.max(insets.bottom, space.lg) + space["2xl"] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand mark */}
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
              <Ionicons name="water" size={30} color={palette.white} />
            </LinearGradient>
            <Text style={styles.eyebrow}>BASIT SANITARY</Text>
          </MotiView>

          {/* Card */}
          <MotiView
            from={{ opacity: 0, translateY: 28 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 16, stiffness: 160, delay: 120 }}
            style={styles.card}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>

            {/* Email */}
            <View
              style={[
                styles.field,
                focused === "email" && styles.fieldFocused,
                emailError && styles.fieldError,
              ]}
            >
              <Ionicons name="mail-outline" size={18} color={palette.emerald200} style={styles.fieldIcon} />
              <TextInput
                placeholder="Email address"
                placeholderTextColor={palette.slate500}
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
              />
            </View>
            {emailError && <Text style={styles.errorText}>Please enter a valid email</Text>}

            {/* Password */}
            <View
              style={[
                styles.field,
                focused === "password" && styles.fieldFocused,
                passwordError && styles.fieldError,
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color={palette.emerald200} style={styles.fieldIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={palette.slate500}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                style={styles.input}
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
            {passwordError && (
              <Text style={styles.errorText}>Password must be at least 8 characters</Text>
            )}

            {/* Login button */}
            <TouchableOpacity
              style={styles.ctaWrapper}
              onPress={handleLogin}
              activeOpacity={0.9}
              disabled={loading}
            >
              <LinearGradient
                colors={colors.gradients.emeraldGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>{loading ? "Signing in…" : "Login"}</Text>
                {!loading && <Ionicons name="arrow-forward" size={18} color={palette.white} />}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()} activeOpacity={0.85}>
                <FAIcon name="google" size={20} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                <FAIcon name="facebook" size={20} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                <FAIcon name="apple" size={20} color={palette.white} />
              </TouchableOpacity>
            </View>
          </MotiView>

          {/* Signup link */}
          <View style={styles.signupRow}>
            <Text style={styles.normalText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: space["2xl"],
  },
  brandBadge: {
    width: 64,
    height: 64,
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
    marginBottom: space.xl,
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
  fieldError: {
    borderColor: palette.red,
  },
  fieldIcon: { marginRight: space.sm },
  input: {
    flex: 1,
    ...typography.bodyLg,
    color: palette.white,
    paddingVertical: 0,
  },
  errorText: {
    ...typography.caption,
    color: palette.red,
    marginTop: space.xs,
    marginLeft: space.xs,
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: space.xl,
    gap: space.md,
  },
  divider: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.12)" },
  dividerText: {
    ...typography.caption,
    color: palette.slate300,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: space.lg,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
});

export default LoginScreen;
