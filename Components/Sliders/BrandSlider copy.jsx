import React, { useEffect, useState } from "react";
import { View,Text, Image, ActivityIndicator, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const BrandSlider = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.100.7:5004/brands") // Replace with your API URL
      .then((response) => response.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ alignItems: "center", paddingVertical: 10 }}>
      <Text style={{fontWeight:'bold',fontSize:20,paddingBottom:10}}>Popular Brands</Text>
      <Carousel
        width={width * 0.5} // Adjust width of each item
        height={100}
        data={brands}
        scrollAnimationDuration={500}
        mode="horizontal" // Enable horizontal scrolling
        loop // Enable infinite loop
        autoPlay // Enable autoplay
        autoPlayInterval={2000} // Set autoplay interval
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image_url }}
            style={{ width: width * 0.5, height: 100, borderRadius: 5,borderWidth:1,backgroundColor:"black" }}
            resizeMode="contain"
          />
        )}
      />
    </View>
  );
};

export default BrandSlider;
