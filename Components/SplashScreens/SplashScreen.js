import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Animatable from "react-native-animatable";

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
    }, 5000); 

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeIn" duration={2000} style={styles.welcomeText}>
        {displayedText}
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black",paddingHorizontal:15 },
  welcomeText: { fontSize: 32, fontWeight: "bold", color: "#10B981", textAlign: "center" },
  loader: { marginTop: 20 },
});

export default SplashScreen;
