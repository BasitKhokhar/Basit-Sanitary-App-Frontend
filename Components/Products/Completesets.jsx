import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductModal from "./ProductModal";
import { colors } from "../Themes/colors";

const Completesets = ({ sets }) => {
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };
    fetchUserId();
  }, []);

  const openProductModal = (product) => {
    const formattedProduct = {
      id: product.id,
      name: product.name || "Unnamed",
      price: product.price || "N/A",
      image_url: product.image_url || "",
      stock: product.stock || "N/A",
      subcategory_id: product.subcategory_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
    setSelectedProduct(formattedProduct);
  };

  const closeProductModal = () => setSelectedProduct(null);

  if (!Array.isArray(sets) || sets.length === 0) {
    return (
      <View style={{ alignItems: "center", marginVertical: 40 }}>
        <Text style={{ fontSize: 16, color: colors.mutedText }}>
          No complete sets available
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Complete Accessory Sets
      </Text>
      <FlatList
        data={sets}
        keyExtractor={(item, index) => item?.id?.toString() || `key-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.productCard,
              { backgroundColor: colors.cardsbackground, shadowColor: colors.text },
              index % 2 === 0 ? styles.offsetCard : {},
            ]}
          >
            <Image
              source={{ uri: item.image_url || "https://via.placeholder.com/100" }}
              style={[styles.productImage, { borderColor: colors.border }]}
              resizeMode="cover"
              onError={(e) => console.warn("Image load error:", e.nativeEvent?.error)}
            />
            <Text style={[styles.productName, { color: colors.text }]}>
              {item.name || "Unnamed"}
            </Text>
            <Text style={[styles.productStock, { color: colors.mutedText }]}>
              Stock: {item.stock || "N/A"}
            </Text>
            <Text style={[styles.newProductPrice, { color: colors.primary }]}>
              Now: {item.price ? Math.floor(item.price) : "N/A"}
            </Text>
            <TouchableOpacity
              style={[styles.shopNowButton, { backgroundColor: colors.text }]}
              onPress={() => openProductModal(item)}
            >
              <Text style={[styles.shopNowText, { color: colors.white }]}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeProductModal}
          userId={userId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 35,
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  offsetCard: {
    marginTop: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  productStock: {
    fontSize: 12,
  },
  newProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shopNowButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  shopNowText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Completesets;
