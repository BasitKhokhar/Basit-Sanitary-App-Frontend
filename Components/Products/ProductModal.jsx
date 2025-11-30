import React, { useState,useContext } from "react";
import { CartContext } from "../../src/ContextApis/cartContext";
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";


import { colors } from "../Themes/colors";
import { apiFetch } from "../../src/apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const { width, height } = Dimensions.get("window");

const colorOptions = ["White", "Half White", "Chrome", "Light Pink", "Light Grey", "Burgundy"];

const ProductModal = ({ product, onClose, userId }) => {
  const { fetchCartCount } = useContext(CartContext);
  const [selectedColor, setSelectedColor] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleAddToCart = async () => {
    const productWithOptions = {
      ...product,
      selectedColor: selectedColor || "None",
      quantity: 1,
      user_id: userId,
    };

    try {
      const response = await apiFetch(`/cart/addtocart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithOptions),
      });
     
      const data = await response.json();
   
      if (response.ok) {
        setConfirmationMessage(data.message || "Product added to cart");
        setConfirmationVisible(true);
        setTimeout(() => {
          setConfirmationVisible(false);
          onClose();
        }, 2000);
        
      } 
      else {
        console.error("Failed to add product to cart");
      }
       fetchCartCount();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal visible={true} transparent={true} animationType="slide">
        <View style={[styles.modalOverlay]}>
          <View style={[styles.modalContent, { backgroundColor: colors.formbg,borderColor:colors.border}]}>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <FontAwesome name="times" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Image source={{ uri: product.image_url }} style={styles.productImage} />
            <Text style={[styles.productName, { color: colors.white }]}>{product.name}</Text>
            <Text style={[styles.productStock, { color: colors.mutedText }]}>Stock: {product.stock}</Text>
            <Text style={[styles.productPrice, { color: colors.primary }]}>
              Price: {Math.floor(product.price)}
            </Text>

            {/* Color Selection */}
            <View style={styles.colorSelector}>
              <Text style={[styles.label, { color: colors.white }]}>Select Color:</Text>
              <View style={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorBox,
                      { borderColor: colors.primary },
                      selectedColor === color && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text style={[styles.colorText, { color: colors.white, fontWeight: '500' }]}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <LinearGradient
              colors={colors.gradients.mintGlow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cartButton}
            >
              <TouchableOpacity
                onPress={handleAddToCart}
                // style={[styles.cartButton, { backgroundColor: colors.primary }]}
              >

                <Text style={styles.buttonText}>Add to Cart</Text>

              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal >

      {/* Confirmation Modal */}
      < Modal visible={confirmationVisible} transparent={true} animationType="slide" >
        <View style={styles.confirmationOverlay}>
          <View style={[styles.confirmationBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.confirmationText}>{confirmationMessage}</Text>
          </View>
        </View>
      </Modal >
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    elevation: 10,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.4,
    // shadowRadius: 6,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  productImage: {
    width: width * 0.5,
    height: width * 0.4,
    borderRadius: 10,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: colors.white,
  },
  productName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  productStock: {
    fontSize: width * 0.04,
    textAlign: "center",
  },
  productPrice: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "center",
  },
  colorSelector: {
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: 5,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
  colorBox: {
    backgroundColor: colors.formbg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
  },
  colorText: {
    fontSize: width * 0.035,
  },
  cartButton: {
    paddingVertical: 12,paddingHorizontal:50,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmationOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  confirmationBox: {
    width: "90%",
    marginBottom: 40,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  confirmationText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductModal;
