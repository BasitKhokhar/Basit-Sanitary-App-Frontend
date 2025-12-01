// components/AppContainer.js
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Universal App Container
 * - Handles StatusBar
 * - Handles SafeArea for left/right
 * - Provides consistent background
 */
const AppContainer = ({ children, backgroundColor = "#F8F9FA" }) => {
  return (
    <View style={[styles.root, { backgroundColor }]}>
      {/* Transparent StatusBar so header can overlap */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content" // light-content if you use dark headers
      />

      {/* SafeArea protects sides but not top/bottom (so header/footer can extend) */}
      <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </View>
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
