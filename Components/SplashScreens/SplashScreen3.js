import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../Themes/colors";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SplashScreen3 = ({ onNext }) => {
  return (
    <View style={styles.container}>
      {/* Top Image with gradient overlay */}
      <View style={styles.topContainer}>
        <ImageBackground
          source={require("../../assets/splash222.jpg")}
          style={styles.image}
        >
          {/* Updated Gradient Overlay to match dark header background */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.70)", colors.headerbg]}
            style={styles.overlay}
          >
            <Text style={styles.title}>🛁 Explore Our Premium Sanitary Products</Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Browse taps, showers, bathroom fittings, pipes, kitchen accessories, and much more — all from top trusted brands.
        </Text>

        {/* Neon Gradient Button */}
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.9}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={colors.gradients.mintGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.headerbg, 
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    height: "73%", 
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  overlay: {
    width: "100%",
    padding: 20,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white, 
    textAlign: "center",
  },

  contentContainer: {
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.headerbg,
    paddingBottom: 20,
    paddingTop: 5,
  },

  description: {
    fontSize: 16,
    color: colors.secondary, 
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },

  buttonWrapper: {
    width: "100%",
    borderRadius: 40,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});

export default SplashScreen3;
