// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import ProductModal from "./ProductModal";
// import { colors } from "../Themes/colors";

// const Completesets = ({ sets }) => {
//   const [userId, setUserId] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem("userId");
//         if (storedUserId) setUserId(storedUserId);
//       } catch (error) {
//         console.error("Error fetching userId:", error);
//       }
//     };
//     fetchUserId();
//   }, []);

//   const openProductModal = (product) => {
//     const formattedProduct = {
//       id: product.id,
//       name: product.name || "Unnamed",
//       price: product.price || "N/A",
//       image_url: product.image_url || "",
//       stock: product.stock || "N/A",
//       subcategory_id: product.subcategory_id,
//       created_at: product.created_at,
//       updated_at: product.updated_at,
//     };
//     setSelectedProduct(formattedProduct);
//   };

//   const closeProductModal = () => setSelectedProduct(null);

//   if (!Array.isArray(sets) || sets.length === 0) {
//     return (
//       <View style={{ alignItems: "center", marginVertical: 40 }}>
//         <Text style={{ fontSize: 16, color: colors.mutedText }}>
//           No complete sets available
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
//       <Text style={[styles.heading, { color: colors.text }]}>
//         Complete Accessory Sets
//       </Text>
//       <FlatList
//         data={sets}
//         keyExtractor={(item, index) => item?.id?.toString() || `key-${index}`}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         renderItem={({ item, index }) => (
//           <View
//             style={[
//               styles.productCard,
//               { backgroundColor: colors.cardsbackground, shadowColor: colors.text },
//               index % 2 === 0 ? styles.offsetCard : {},
//             ]}
//           >
//             <Image
//               source={{ uri: item.image_url || "https://via.placeholder.com/100" }}
//               style={[styles.productImage, { borderColor: colors.border }]}
//               resizeMode="cover"
//               onError={(e) => console.warn("Image load error:", e.nativeEvent?.error)}
//             />
//             <Text style={[styles.productName, { color: colors.text }]}>
//               {item.name || "Unnamed"}
//             </Text>
//             <Text style={[styles.productStock, { color: colors.mutedText }]}>
//               Stock: {item.stock || "N/A"}
//             </Text>
//             <Text style={[styles.newProductPrice, { color: colors.primary }]}>
//               Now: {item.price ? Math.floor(item.price) : "N/A"}
//             </Text>
//             <TouchableOpacity
//               style={[styles.shopNowButton, { backgroundColor: colors.text }]}
//               onPress={() => openProductModal(item)}
//             >
//               <Text style={[styles.shopNowText, { color: colors.white }]}>Shop Now</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       {selectedProduct && (
//         <ProductModal
//           product={selectedProduct}
//           onClose={closeProductModal}
//           userId={userId}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 35,
//     textAlign: "center",
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//   },
//   productCard: {
//     width: "48%",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 15,
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   offsetCard: {
//     marginTop: 20,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//     borderWidth: 2,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   productStock: {
//     fontSize: 12,
//   },
//   newProductPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   shopNowButton: {
//     marginTop: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 5,
//   },
//   shopNowText: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });

// export default Completesets;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import ProductModal from "./ProductModal";
import { colors } from "../Themes/colors";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;
const ITEM_HEIGHT = 200;
const SPACING = 0;
const CENTER_OFFSET = (width - ITEM_WIDTH) / 2;

// const GRADIENT_COLORS = [
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
const GRADIENT_COLORS = [
  // 1. Royal Sunset
  ["#232526", "#414345"],
  ["#0f0c29", "#302b63", "#24243e"],
  ["#2193b0", "#6dd5ed"],

  // 5. Blue Steel
  ["#373B44", "#4286f4"],

  // 6. Red Fusion
  ["#CB356B", "#BD3F32"],

  // 7. Aqua Glow
  ["#13547a", "#80d0c7"],

  // 8. Purple Dream
  ["#654ea3", "#eaafc8"],
["#1a2a6c", "#b21f1f", "#fdbb2d"],
  // 9. Emerald Sky
  ["#56ab2f", "#a8e063"],

  // 10. Cosmic Purple
  ["#360033", "#0b8793"],
];

const Completesets = ({ sets }) => {
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const scrollX = React.useRef(new Animated.Value(0)).current;

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
    setSelectedProduct(product);
  };

  const closeProductModal = () => setSelectedProduct(null);

  if (!sets || sets.length === 0) {
    return (
      <View style={{ paddingVertical: 40, alignItems: "center" }}>
        <Text style={{ color: colors.mutedText, fontSize: 16 }}>
          No complete sets available.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Complete Accessory Sets
      </Text>

      <Animated.FlatList
        data={sets}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        pagingEnabled
        contentContainerStyle={{ paddingHorizontal: CENTER_OFFSET }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: "clamp",
          });

          const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
          const imageFailed = imageErrors[item.id];

          return (
            <Animated.View style={[styles.productCard, { transform: [{ scale }] }]}>
              <LinearGradient
                colors={gradient}
                style={styles.gradientBackground}
                start={{ x: -0.2, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardheader}>
                  {!imageFailed ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={[styles.productImage, { borderColor: colors.border }]}
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [item.id]: true }))
                      }
                    />
                  ) : (
                    <View
                      style={[
                        styles.productImage,
                        {
                          backgroundColor: colors.secondary,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                      ]}
                    >
                      <Text style={{ color: colors.text, fontSize: 10 }}>
                        Image Error
                      </Text>
                    </View>
                  )}

                  <View style={styles.imagedata}>
                    <Text style={[styles.productName, { color: colors.white }]}>
                      {item.name}
                    </Text>

                    <Text style={[styles.productStock, { color: colors.white }]}>
                      Stock: {item.stock}
                    </Text>

                    <Text style={[styles.newProductPrice, { color: colors.white }]}>
                      Price: {item.price ? Math.floor(item.price) : "N/A"}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.shopNowButton,
                        { backgroundColor: colors.white, borderColor: colors.text },
                      ]}
                      onPress={() => openProductModal(item)}
                    >
                      <Text style={[styles.shopNowText, { color: colors.text }]}>
                        Shop Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          );
        }}
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
  container: { paddingBottom: 30 },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  productCard: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: SPACING / 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  gradientBackground: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
  },
  cardheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 5,
    borderWidth: 2,
  },
  imagedata: { flexDirection: "column", width: "40%" },
  productName: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  productStock: { fontSize: 12 },
  productPrice: { fontSize: 16, textDecorationLine: "line-through" },
  newProductPrice: { fontSize: 16, fontWeight: "bold" },
  shopNowButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
  },
  shopNowText: { fontSize: 14, fontWeight: "bold" },
});

export default Completesets;



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   Animated,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import ProductModal from "./ProductModal";
// import { colors } from "../Themes/colors";

// const { width } = Dimensions.get("window");
// const ITEM_WIDTH = width * 0.78;
// const ITEM_HEIGHT = 230;
// const CENTER_OFFSET = (width - ITEM_WIDTH) / 2;

// const Completesets = ({ sets }) => {
//   const [userId, setUserId] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [imageErrors, setImageErrors] = useState({});
//   const scrollX = React.useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     AsyncStorage.getItem("userId").then((id) => setUserId(id || null));
//   }, []);

//   const gradientColors = [
//     ["#1a2a6c", "#b21f1f", "#fdbb2d"], // sunrise
//     ["#232526", "#414345"], // carbon
//     ["#0f0c29", "#302b63", "#24243e"], // royal dark
//     ["#2193b0", "#6dd5ed"], // deep ocean
//     ["#373B44", "#4286f4"], // steel blue
//     ["#CB356B", "#BD3F32"], // red fusion
//   ];

//   if (!sets || sets.length === 0) {
//     return (
//       <View style={styles.emptyBox}>
//         <Text style={{ color: colors.mutedText, fontSize: 16 }}>
//           No complete sets available.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
//       <Text style={[styles.heading, { color: colors.text }]}>
//         Complete Accessory Sets
//       </Text>

//       <Animated.FlatList
//         data={sets}
//         keyExtractor={(item) => item.id?.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={ITEM_WIDTH}
//         decelerationRate="fast"
//         pagingEnabled
//         contentContainerStyle={{ paddingHorizontal: CENTER_OFFSET }}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: true }
//         )}
//         renderItem={({ item, index }) => {
//           const gradient = gradientColors[index % gradientColors.length];

//           const inputRange = [
//             (index - 1) * ITEM_WIDTH,
//             index * ITEM_WIDTH,
//             (index + 1) * ITEM_WIDTH,
//           ];

//           const scale = scrollX.interpolate({
//             inputRange,
//             outputRange: [0.85, 1, 0.85],
//             extrapolate: "clamp",
//           });

//           const elevate = scrollX.interpolate({
//             inputRange,
//             outputRange: [0, -10, 0],
//             extrapolate: "clamp",
//           });

//           const imageFailed = imageErrors[item.id];

//           return (
//             <Animated.View
//               style={[
//                 styles.cardWrapper,
//                 {
//                   transform: [{ scale }, { translateY: elevate }],
//                 },
//               ]}
//             >
//               <LinearGradient
//                 colors={gradient}
//                 style={styles.gradientCard}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//               >
//                 <View style={styles.innerContainer}>
//                   {/* Product Image */}
//                   <View style={styles.imageBox}>
//                     {!imageFailed ? (
//                       <Image
//                         source={{ uri: item.image_url }}
//                         style={styles.productImage}
//                         onError={() =>
//                           setImageErrors((prev) => ({
//                             ...prev,
//                             [item.id]: true,
//                           }))
//                         }
//                       />
//                     ) : (
//                       <View style={styles.errorImageBox}>
//                         <Text style={{ color: colors.white, fontSize: 11 }}>
//                           Image Error
//                         </Text>
//                       </View>
//                     )}
//                   </View>

//                   {/* Product Info */}
//                   <View style={styles.infoBox}>
//                     <Text style={styles.productName}>{item.name}</Text>

//                     <Text style={styles.stock}>Stock: {item.stock}</Text>

//                     <Text style={styles.price}>
//                       Rs. {item.price ? Math.floor(item.price) : "N/A"}
//                     </Text>

//                     <TouchableOpacity
//                       style={styles.shopButton}
//                       onPress={() => setSelectedProduct(item)}
//                     >
//                       <Text style={styles.shopText}>Shop Now</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </LinearGradient>
//             </Animated.View>
//           );
//         }}
//       />

//       {/* Modal */}
//       {selectedProduct && (
//         <ProductModal
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//           userId={userId}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { paddingBottom: 30 },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     letterSpacing: 0.8,
//   },

//   cardWrapper: {
//     width: ITEM_WIDTH,
//     height: ITEM_HEIGHT,
//     borderRadius: 18,
//     marginHorizontal: 10,
//     overflow: "hidden",
//     elevation: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 6 },
//   },

//   gradientCard: {
//     flex: 1,
//     borderRadius: 18,
//     padding: 12,
//     justifyContent: "center",
//   },

//   innerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     height: "100%",
//   },

//   imageBox: {
//     width: "45%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   productImage: {
//     width: 130,
//     height: 130,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,0.3)",
//   },

//   errorImageBox: {
//     width: 130,
//     height: 130,
//     borderRadius: 12,
//     backgroundColor: "#00000044",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   infoBox: {
//     flex: 1,
//     paddingLeft: 10,
//     paddingRight: 5,
//     justifyContent: "center",
//   },

//   productName: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },

//   stock: {
//     color: "#eeeeee",
//     fontSize: 12,
//     marginBottom: 4,
//   },

//   price: {
//     color: "#ffffff",
//     fontSize: 17,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },

//   shopButton: {
//     backgroundColor: "#ffffff",
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 25,
//     alignSelf: "flex-start",
//   },

//   shopText: {
//     color: "#333",
//     fontWeight: "700",
//     fontSize: 14,
//   },

//   emptyBox: {
//     paddingVertical: 40,
//     alignItems: "center",
//   },
// });

// export default Completesets;
