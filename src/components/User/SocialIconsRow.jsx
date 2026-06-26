
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../Themes/colors";
import { apiFetch } from "../../src/apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const iconMap = {
  "fa-brands fa-facebook": { name: "facebook", color: "white" },
  "fa-brands fa-facebook-messenger": { name: "facebook-messenger", color: "white" },
  "fa-brands fa-tiktok": { name: "tiktok", color: "white" },
  "fa-brands fa-linkedin": { name: "linkedin-in", color: "white" },
};

const SocialIconsRow = () => {
  const [socialIcons, setSocialIcons] = useState([]);

  useEffect(() => {
    apiFetch(`/content/socialicons`)
      .then((response) => response.json())
      .then((data) => setSocialIcons(data))
      .catch((error) => console.error("Error fetching social icons:", error));
  }, []);

  const handlePress = (url) => {
    Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
  };

  const renderItem = ({ item }) => {
    const iconData = iconMap[item.icons] || { name: "question-circle", color: colors.mutedText };
    const scale = new Animated.Value(1);

    const onPressIn = () => Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
    const onPressOut = () =>
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

    return (
      <Animated.View style={{ transform: [{ scale }], marginRight: 15 }}>
        <TouchableOpacity
          onPress={() => handlePress(item.routes)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <LinearGradient
            colors={colors.gradients.dark}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCard}
          >
            <FontAwesome5 name={iconData.name} size={28} color={iconData.color} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Text style={[styles.title, { color: colors.text }]}>Follow Us:</Text>
      <FlatList
        data={socialIcons}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor:colors.border,
    borderRadius: 10,borderWidth:1,borderColor:colors.border,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingHorizontal:10 ,paddingVertical:20
  },
  title: {
    fontSize: 24,
    marginLeft:10,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  iconCard: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default SocialIconsRow;
