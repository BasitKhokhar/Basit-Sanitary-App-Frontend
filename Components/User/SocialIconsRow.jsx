import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const iconMap = {
  "fa-brands fa-facebook": { name: "facebook", color: "#1877F2" },
  "fa-brands fa-facebook-messenger": { name: "facebook-messenger", color: "#0099FF" },
  "fa-brands fa-tiktok": { name: "tiktok", color: "#000000" },
  "fa-brands fa-linkedin": { name: "linkedin-in", color: "#0077B5" }
};

const SocialIconsRow = () => {
  const [socialIcons, setSocialIcons] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/social_icons`) // Replace with your actual API URL
      .then(response => response.json())
      .then(data => setSocialIcons(data))
      .catch(error => console.error('Error fetching social icons:', error));
  }, []);

  const handlePress = (url) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const renderItem = ({ item }) => {
    const iconData = iconMap[item.icons] || { name: "question-circle", color: "gray" }; // Default fallback
    return (
      <TouchableOpacity onPress={() => handlePress(item.routes)} style={styles.iconContainer}>
        <FontAwesome5 name={iconData.name} size={30} color={iconData.color} style={styles.icon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Links:</Text>
      <FlatList
        data={socialIcons}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingHorizontal:10 ,paddingVertical:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  iconContainer: {
    // marginHorizontal: 10,
  },
  icon: {
    paddingRight: 20,
  },
});

export default SocialIconsRow;
