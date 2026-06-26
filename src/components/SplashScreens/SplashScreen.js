import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import {colors} from "../Themes/colors";

const SplashScreen = ({ navigation }) => {
  const fullText = "Welcome to Basit Sanitary App";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);

    setTimeout(() => {
      navigation.replace("Main");
    }, 4000);

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.headerbg }]}>
      <Animatable.Text
        animation="fadeIn"
        duration={2000}
        style={[styles.welcomeText, { color: colors.primary }]}
      >
        {displayedText}
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1.2,
    lineHeight: 42,
    // fontFamily: "Poppins-Bold", // optional: add a custom font
  },
});

export default SplashScreen;
