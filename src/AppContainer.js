// components/AppContainer.js
import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

/**
 * Universal App Container
 * - Handles StatusBar
 * - Handles SafeArea for left/right
 * - Provides consistent background
 * - Gives the Android native bottom navigation bar a whitish background with
 *   dark icons (instead of the default transparent/edge-to-edge look).
 */
const AppContainer = ({
  children,
  backgroundColor = "#F8F9FA",
  barStyle = "light-content",
  // Native Android bottom navigation bar color (whitish, not transparent).
  navigationBarColor = "#F8F9FA",
}) => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    // Dark button icons so they read on a light bar (works under edge-to-edge).
    NavigationBar.setButtonStyleAsync("dark").catch(() => {});
    // Solid background for non-edge-to-edge builds. Under SDK 54 edge-to-edge
    // this is a no-op (the OS forces a transparent bar) — the whitish `root`
    // background below shows through it, so the bar still reads as light.
    NavigationBar.setBackgroundColorAsync(navigationBarColor).catch(() => {});
  }, [navigationBarColor]);

  return (
    <SafeAreaProvider>
      <View style={[styles.root, { backgroundColor }]}>
        {/* Transparent StatusBar so header can overlap */}
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={barStyle} // dark-content over light surfaces, light-content over dark
        />

        {/* SafeArea protects sides but not top/bottom (so header/footer can extend) */}
        <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
          {children}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default AppContainer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
