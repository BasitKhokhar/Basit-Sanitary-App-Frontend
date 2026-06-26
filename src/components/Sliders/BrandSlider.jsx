import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const itemWidth = width / 3 - 20;

const BrandSlider = ({ brands }) => {
  const filteredBrands = Array.isArray(brands)
    ? brands.filter((item) => item?.id && item?.image_url)
    : [];

  return (
    <LinearGradient
      colors={["#001F3F", "#003366", "#004C99"]}
      start={{ x: -0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Our Brands</Text>
        <FlatList
          data={filteredBrands}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <View style={styles.brandItem}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.brandImage}
                resizeMode="cover"
                onError={() => console.warn("Failed to load brand image:", item.image_url)}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#fff", textAlign: "center" }}>
              No brands available
            </Text>
          }
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
    paddingBottom: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  brandItem: {
    width: itemWidth,
    alignItems: "center",
  },
  brandImage: {
    width: itemWidth,
    height: 70,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "black",
  },
});

export default BrandSlider;
