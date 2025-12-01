
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import * as Animatable from "react-native-animatable";

import splashLogo from "../../assets/icons.png"; 
const SplashScreen1 = () => {
  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="zoomIn"
        duration={1500}
        source={splashLogo}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
    resizeMode: "contain",
  },
});

export default SplashScreen1;
