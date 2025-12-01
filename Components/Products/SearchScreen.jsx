// import React, { useState, useEffect } from "react";
// import {
//   View,
//   TextInput,
//   FlatList,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import ProductModal from "./ProductModal";
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const SearchScreen = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     // Fetch products from API
//     fetch(`${API_BASE_URL}/products`) // Replace with your API URL
//       .then((response) => response.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error("Error fetching products:", error));

//     // Retrieve userId from AsyncStorage
//     const getUserId = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem("userId");
//         if (storedUserId) {
//           setUserId(storedUserId);
//         }
//       } catch (error) {
//         console.error("Error retrieving user ID:", error);
//       }
//     };

//     getUserId();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredProducts([]);
//     } else {
//       const results = products.filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredProducts(results);
//     }
//   }, [searchQuery]);

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search for products..."
//         onChangeText={setSearchQuery}
//         value={searchQuery}
//       />
//       <FlatList
//         data={filteredProducts}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.item}
//             onPress={() => setSelectedProduct(item)}
//           >
//             <Image source={{ uri: item.image_url }} style={styles.productImage} />
//             <View>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.productPrice}>{item.price}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />

//       {/* Show ProductModal when a product is selected */}
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
//   container: { flex: 1, padding: 10 },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   item: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
//   productImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   productPrice: {
//     fontSize: 14,
//     color: "#007BFF",
//   },
// });

// export default SearchScreen;
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductModal from "./ProductModal";
import Constants from "expo-constants";
import { apiFetch } from "../../src/apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async (resetPage = false) => {
    if (searchQuery.trim() === "") {
      setProducts([]);
      return;
    }

    const nextPage = resetPage ? 1 : page;

    try {
      const response = await apiFetch(
        `/products/search?q=${searchQuery}&page=${nextPage}&limit=10`
      );

      const data = await response.json();

      if (resetPage) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }

      setHasMore(data.hasMore);
      setPage(nextPage + 1);
    } catch (error) {
      console.error("Error fetching searched products:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(true);
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products..."
        onChangeText={(text) => {
          setSearchQuery(text);
          setPage(1);
        }}
        value={searchQuery}
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (hasMore) fetchProducts();
        }}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelectedProduct(item)}
          >
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { fontSize: 14, color: "#007BFF" },
});

export default SearchScreen;
