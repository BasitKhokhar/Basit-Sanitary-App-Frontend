import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { colors } from "../Themes/colors";   // ✅ THEME IMPORT

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const CustomerSupportScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      
    

      <Text style={[styles.text, { color: colors.text }]}>
        Get help and support anytime. Whether you have questions, need technical assistance,
        or require urgent help, our team is here for you 24/7. Reach out via chat, call,
        or email—we’re always ready to assist!
      </Text>

      <View style={styles.data}>
        
        {/* EMAIL BOX */}
        <LinearGradient
          colors={colors.gradients.mintGlow}    // ✅ Theme gradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.containergradient}
        >
          <View style={styles.emailbox}>
            <Text style={[styles.headings, { color: colors.text }]}>Emails:</Text>
            <Text style={[styles.headingtext, { color: colors.text }]}>1. basitsanitaryapp@gmail.com</Text>
            <Text style={[styles.headingtext, { color: colors.text }]}>2. basitsanitaryapp@gmail.com</Text>
          </View>
        </LinearGradient>

        {/* PHONE BOX */}
        <LinearGradient
          colors={colors.gradients.ocean}       // ✅ Theme gradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.containergradient}
        >
          <View style={styles.emailbox}>
            <Text style={[styles.headings, { color: colors.white }]}>Phone No:</Text>
            <Text style={[styles.headingtext, { color: colors.white }]}>1. +92 306-0760549</Text>
            <Text style={[styles.headingtext, { color: colors.white }]}>2. +92 315-4949862</Text>
            <Text style={[styles.headingtext, { color: colors.white }]}>3. +92 306-0760549</Text>
          </View>
        </LinearGradient>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  text: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "justify",
  },

  data: {
    flexDirection: "column",
    rowGap: 18,
    marginTop: 10,
  },

  containergradient: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 12,
  },

  headings: {
    fontSize: 18,
    fontWeight: "bold",
  },

  headingtext: {
    fontSize: 16,
    fontWeight: "500",
  },

  emailbox: {
    flexDirection: "column",
    rowGap: 8,
  },
});

export default CustomerSupportScreen;
