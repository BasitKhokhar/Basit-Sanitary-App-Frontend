
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductModal from "./ProductModal";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../Themes/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// const gradients = [
//   ["#1A1A1A", "#4B4B4B", "#696969"],
//   ["#8A2BE2", "#9370DB", "#BA55D3"],
//   ["#0000FF", "#4169E1", "#00BFFF"],
//   ["#87CEEB", "#4682B4", "#1E90FF"],
//   ["#00CED1", "#20B2AA", "#40E0D0"],
//   ["#008000", "#32CD32", "#00FA9A"],
//   ["#2F4F4F", "#556B2F", "#6B8E23"],
//   ["#FFD700", "#FFA500", "#FF8C00"],
//   ["#FF4500", "#FF6347", "#FF7F50"],
//   ["#A52A2A", "#B22222", "#DC143C"],
// ];
const gradients = [
  ["#232526", "#414345"],
  ["#0f0c29", "#302b63", "#24243e"],
  ["#2193b0", "#6dd5ed"],
  ["#373B44", "#4286f4"],
  ["#CB356B", "#BD3F32"],
  ["#13547a", "#80d0c7"],
  ["#654ea3", "#eaafc8"],
  ["#1a2a6c", "#b21f1f", "#fdbb2d"],
  ["#56ab2f", "#a8e063"],
  ["#360033", "#0b8793"],
];
const TrendingProducts = ({ products }) => {
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const position = useRef(new Animated.ValueXY()).current;
  const [cardProducts, setCardProducts] = useState([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const prepared = products.map((p, i) => ({
        ...p,
        gradient: gradients[i % gradients.length],
      }));
      setCardProducts(prepared);
    }
  }, [products]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(id);
    };
    fetchUserId();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 120) {
          Animated.timing(position, {
            toValue: { x: gesture.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            setCardProducts((prev) => {
              const updated = [...prev];
              const first = updated.shift();
              updated.push(first);
              return updated;
            });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const openProductModal = (product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  if (!cardProducts.length) {
    return (
      <View style={{ alignItems: "center", marginVertical: 40 }}>
        <Text style={{ fontSize: 16, color: colors.mutedText }}>No trending products</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      {cardProducts.map((item, index) => {
        const isTopCard = index === 0;
        const animatedStyle = isTopCard
          ? {
              transform: [
                {
                  rotate: position.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ["-10deg", "0deg", "10deg"],
                  }),
                },
                ...position.getTranslateTransform(),
              ],
            }
          : { top: index * 5, zIndex: -index };

        return (
          <Animated.View
            key={item.id?.toString() || index.toString()}
            {...(isTopCard ? panResponder.panHandlers : {})}
            style={[styles.card, animatedStyle]}
          >
            <LinearGradient colors={item.gradient} style={styles.cardBackground}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image_url }}
                  style={[styles.image, { borderColor: colors.border }]}
                  resizeMode="stretch"
                  onError={() => console.warn("Failed to load image:", item.name)}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.name, { color: colors.white }]}>{item.name}</Text>
                <Text style={[styles.stock, { color: colors.border }]}>
                  Stock: {item.stock}
                </Text>
                <Text style={[styles.price, { color: colors.white }]}>
                  Price: {Math.floor(item.price)}
                </Text>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.text, borderColor: colors.white }]}
                  onPress={() => openProductModal(item)}
                >
                  <Text style={[styles.buttonText, { color: colors.white }]}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        );
      })}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeProductModal} userId={userId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 60,
    marginBottom: 130,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
  },
  card: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  imageContainer: {
    width: "55%",
    height: "85%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingRight: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 10,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: { fontSize: 14, fontWeight: "bold" },
  stock: { fontSize: 12 },
  price: { fontSize: 16, fontWeight: "bold" },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TrendingProducts;
