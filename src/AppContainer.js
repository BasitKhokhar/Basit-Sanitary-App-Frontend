// components/AppContainer.js
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

/**
 * Universal App Container
 * - Handles StatusBar
 * - Handles SafeArea for left/right
 * - Provides consistent background
 */
const AppContainer = ({ children, backgroundColor = "#F8F9FA", barStyle = "light-content" }) => {
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
