// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import ProductModal from "../Products/ProductModal";
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const Products = ({ route }) => {
//   const { subcategoryId } = route.params;
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem("userId");
//         if (storedUserId) {
//           setUserId(storedUserId);
//         }
//       } catch (error) {
//         console.error("Error fetching userId from AsyncStorage:", error);
//       }
//     };
    
//     fetchUserId();
//     fetchProducts();
//   }, [subcategoryId]);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}/products`);
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleCloseModal = () => {
//     setSelectedProduct(null);
//   };

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Products</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <FlatList
//           data={products}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={2}
//           renderItem={({ item }) => (
//             <View style={{ flex: 1, margin: 5, backgroundColor: "#fff", padding: 10, borderRadius: 10 }}>
//               <Image source={{ uri: item.image_url }} style={{ width: "100%", height: 150, borderRadius: 10 }} />
//               <Text style={{ fontSize: 16, fontWeight: "bold", marginVertical: 5 }}>{item.name}</Text>
//               <Text style={{ fontSize: 14, color: "gray" }}>Rs.{item.price}</Text>
//               <TouchableOpacity onPress={() => handleOpenModal(item)} style={{ alignSelf: "flex-end", marginTop: 5 }}>
//                 <FontAwesome name="shopping-cart" size={24} color="black" />
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//       {selectedProduct && (
//         <ProductModal
//           product={selectedProduct}
//           onClose={handleCloseModal}
//           userId={userId} 
//         />
//       )}
//     </View>
//   );
// };

// export default Products;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductModal from "../Products/ProductModal";
import { colors } from "../Themes/colors";   // ✅ THEME COLORS
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const Products = ({ route }) => {
  const { subcategoryId } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userId, setUserId] = useState(null);

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
    fetchProducts();
  }, [subcategoryId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  const renderItem = ({ item }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: colors.cardsbackground,
        padding: 12,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.text,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: item.image_url }}
        style={{
          width: "100%",
          height: 140,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />

      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          color: colors.text,
        }}
        numberOfLines={1}
      >
        {item.name}
      </Text>

      <Text style={{ fontSize: 14, color: colors.primary, marginVertical: 4 }}>
        Rs. {Math.floor(item.price)}
      </Text>

      {/* Cart Button (not icon only) */}
      <TouchableOpacity
        onPress={() => handleOpenModal(item)}
        style={{
          marginTop: 6,
          backgroundColor: colors.text,
          paddingVertical: 8,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <FontAwesome name="shopping-cart" size={18} color={colors.white} />
        <Text
          style={{
            color: colors.white,
            fontSize: 14,
            fontWeight: "bold",
            marginLeft: 6,
          }}
        >
          Add to Cart
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: colors.bodybackground }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 12,
          color: colors.text,
          textAlign: "center",
        }}
      >
        Products
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }} // ⭐ Perfect spacing
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          userId={userId}
        />
      )}
    </View>
  );
};

export default Products;
