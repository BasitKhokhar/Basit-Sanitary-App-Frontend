// import React, { useState, useEffect } from "react";
// import { StripeProvider } from "@stripe/stripe-react-native";
// import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import SignupScreen from "./Components/Authentication/Signup";
// import LoginScreen from "./Components/Authentication/Login";
// import HomeScreen from "./Components/Home";
// import ProductsScreen from "./Components/Products/ProductsScreen";
// import CartScreen from "./Components/Cart/CartScreen";
// import CheckoutScreen from "./Components/Cart/CheckoutScreen";
// import AddressScreen from "./Components/Cart/AddressScreen";
// import PaymentScreen from "./Components/Cart/PaymentScreen";
// import Categories from "./Components/Categories/Categories";
// import Subcategories from "./Components/Categories/Subcategories";
// import Products from "./Components/Categories/Products";
// import SearchScreen from "./Components/Products/SearchScreen";
// import SplashScreen from "./Components/SplashScreens/SplashScreen";
// import SplashScreen1 from "./Components/SplashScreens/SplashScreen1";
// import SplashScreen2 from "./Components/SplashScreens/SplashScreen2";
// import SplashScreen3 from "./Components/SplashScreens/SplashScreen3";
// import SplashScreen4 from "./Components/SplashScreens/SplashScreen4";
// import SplashScreen5 from "./Components/SplashScreens/SplashScreen5";
// import UserDetailsScreen from "./Components/Cart/UserDetailsScreen";
// import UserScreen from "./Components/User/UserScreen";
// import AccountDetailScreen from "./Components/User/AccountDetailScreen";
// import CustomerSupportScreen from "./Components/User/CustomerSupportScreen";
// import FAQ from "./Components/User/FAQ";
// import Services from "./Components/Services/Services";
// import About from "./Components/User/About";
// import StripePayment from "./Components/Cart/StripePayment";
// import LogoutScreen from "./Components/User/LogoutScreen";
// import 'react-native-gesture-handler';
// import * as SecureStore from 'expo-secure-store';

// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// const stripeKey = Constants.expoConfig.extra.stripePublishableKey;
// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const MainLayout = ({ navigation, children, currentScreen }) => {
//   const [logo, setLogo] = useState(null);

//   useEffect(() => {
//     const fetchLogo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/logo_image`);
//         const data = await response.json();
//         if (data.length > 0) {
//           setLogo(data[0].image_url);
//         }
//       } catch (error) {
//         console.error("Error fetching logo:", error);
//       }
//     };
//     fetchLogo();
//   }, []);
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         {logo && <Image source={{ uri: logo }} style={styles.logo} />}
//         <TouchableOpacity
//           style={styles.searchBar}
//           onPress={() => navigation.navigate("SearchScreen")}
//         >
//           <Text style={styles.searchText}>Search...</Text>
//           <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.body}>{children}</View>
//       <View style={styles.footer}>
//         {[
//           { name: "Home", icon: "home" },
//           { name: "Products", icon: "shopping-bag" },
//           { name: "Cart", icon: "shopping-cart" },
//           { name: "Services", icon: "build" },
//           { name: "Profile", icon: "person" },
//         ].map(({ name, icon }) => {
//           const isActive = currentScreen === name;

//           return (
//             <TouchableOpacity
//               key={name}
//               style={[styles.footerButton, isActive && styles.activeButton]}
//               onPress={() => navigation.navigate(name)}
//               activeOpacity={0.8}
//             >
//               <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
//                 <Icon
//                   name={icon}
//                   size={24}
//                   color={isActive ? "#fff" : "#888"}
//                 />
//               </View>
//               <Text style={[styles.footerText, isActive && styles.activeText]}>
//                 {name}
//               </Text>

//               {/* Cart badge */}
//               {/* {name === "Cart" && (
//                 <View style={styles.cartBadge}>
//                   <Text style={styles.cartCount}>3</Text>
//                 </View>
//               )} */}
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//     </View>
//   );
// };
// const BottomTabs = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: { display: "none" },
//       }}
//     >
//       <Tab.Screen name="Home">
//         {({ navigation }) => (
//           <MainLayout navigation={navigation} currentScreen="Home">
//             <HomeScreen />
//           </MainLayout>
//         )}
//       </Tab.Screen>
//       <Tab.Screen name="Products">
//         {({ navigation }) => (
//           <MainLayout navigation={navigation} currentScreen="Products">
//             <ProductsScreen />
//           </MainLayout>
//         )}
//       </Tab.Screen>
//       <Tab.Screen name="Cart">
//         {({ navigation }) => (
//           <MainLayout navigation={navigation} currentScreen="Cart">
//             <CartScreen />
//           </MainLayout>
//         )}
//       </Tab.Screen>
//       <Tab.Screen name="Services">
//         {({ navigation }) => (
//           <MainLayout navigation={navigation} currentScreen="Services">
//             <Services />
//           </MainLayout>
//         )}
//       </Tab.Screen>
//       <Tab.Screen name="Profile">
//         {({ navigation }) => (
//           <MainLayout navigation={navigation} currentScreen="Profile">
//             <UserScreen />
//           </MainLayout>
//         )}
//       </Tab.Screen>
//     </Tab.Navigator>
//   );
// };
// const App = () => {
//   const [userId, setUserId] = useState(null);
//   const [checkingLogin, setCheckingLogin] = useState(true);
//   const [isSplash1Visible, setIsSplash1Visible] = useState(true);
//   const [isSplash2Visible, setIsSplash2Visible] = useState(null);
//   const [isSplash3Visible, setIsSplash3Visible] = useState(null);
//   const [isSplash4Visible, setIsSplash4Visible] = useState(null);
//   const [isSplash5Visible, setIsSplash5Visible] = useState(null);

//   //   useEffect(() => {
//   //   const clearAppDataOnce = async () => {
//   //     try {
//   //       await AsyncStorage.clear();
//   //       console.log("✅ AsyncStorage cleared");

//   //       await SecureStore.deleteItemAsync("jwt_token");
//   //       await SecureStore.deleteItemAsync("userId"); // add more keys if needed
//   //       console.log("✅ SecureStore cleared");

//   //       console.log("📦 Storage wiped — next start will force login");
//   //     } catch (error) {
//   //       console.error("❌ Error clearing app data:", error);
//   //     }
//   //   };

//   //   clearAppDataOnce();
//   // }, []);


//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("jwt_token");
//         const storedUserId = await AsyncStorage.getItem("userId");
//         console.log("userid in app.js is", storedUserId, token)
//         if (token && storedUserId) {
//           setUserId(storedUserId);
//           setIsSplash2Visible(false);
//           setIsSplash3Visible(false);
//           setIsSplash4Visible(false);
//           setIsSplash5Visible(false);
//         } else {
//           setIsSplash2Visible(true);
//           setIsSplash3Visible(false);
//           setIsSplash4Visible(false);
//           setIsSplash5Visible(false);
//         }
//       } catch (error) {
//         console.error("Error checking login:", error);
//       } finally {
//         setCheckingLogin(false);
//       }
//     };

//     checkLogin();
//   }, []);

//   useEffect(() => {
//     const splashFlow = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//       setIsSplash1Visible(false);
//     };

//     splashFlow();
//   }, []);

//   if (isSplash1Visible) {
//     return <SplashScreen1 />;
//   }

//   if (isSplash2Visible) {
//     return <SplashScreen2 onNext={() => {
//       setIsSplash2Visible(false);
//       setIsSplash3Visible(true);
//     }} />;
//   }
//   if (isSplash3Visible) {
//     return <SplashScreen3 onNext={() => {
//       setIsSplash3Visible(false);
//       setIsSplash4Visible(true);
//     }} />;
//   }
//   if (isSplash4Visible) {
//     return <SplashScreen4 onNext={() => {
//       setIsSplash4Visible(false);
//       setIsSplash5Visible(true);
//     }} />;
//   }

//   if (isSplash5Visible) {
//     return <SplashScreen5 onNext={() => setIsSplash5Visible(false)} />;
//   }

//   if (checkingLogin) {
//     return <SplashScreen />;
//   }
//   return (
//     <StripeProvider
//       publishableKey={stripeKey}
//       merchantDisplayName="Basit Sanitary App"
//     >
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName={userId ? "Main" : "Login"}>
//           <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="Login" options={{ headerShown: false }}>
//             {(props) => <LoginScreen {...props} setUserId={setUserId} />}
//           </Stack.Screen>
//           <Stack.Screen name="Main" options={{ headerShown: false }}>
//             {(props) => <BottomTabs {...props} />}
//           </Stack.Screen>
//           <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout" }} />
//           <Stack.Screen name="AddressScreen" component={AddressScreen} />
//           <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
//           <Stack.Screen name="Profile" component={UserScreen} options={{ title: "Profile" }} />
//           <Stack.Screen name="Categories" component={Categories} />
//           <Stack.Screen name="Subcategories" component={Subcategories} />
//           <Stack.Screen name="Products" component={Products} />
//           <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: "Search Products" }} />
//           <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
//           <Stack.Screen name="User" component={UserScreen} />
//           <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
//           <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
//           <Stack.Screen name="faq" component={FAQ} />
//           <Stack.Screen name="about" component={About} />
//           <Stack.Screen name="StripePayment" component={StripePayment} />
//           <Stack.Screen name="Logout" component={LogoutScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </StripeProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     backgroundColor: "#1A1A1A",
//     paddingTop: 15,
//     padding: 20,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   logo: { width: 100, height: 40, resizeMode: "contain", backgroundColor: '#1A1A1A' },
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     height: 35,
//     width: "50%",
//   },
//   searchText: { flex: 1, color: "#555" },
//   searchIcon: { marginLeft: 5 },
//   body: { flex: 1, padding: 0 },
//  footer: {
//   flexDirection: "row",
//   justifyContent: "space-around",
//   position: "absolute",
//   bottom: 20,
//   left: 10,
//   right: 10,
//   backgroundColor: "#1A1A1A",
//   borderRadius: 35,
//   paddingVertical: 10,
//   paddingHorizontal: 15,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 8 },
//   shadowOpacity: 0.25,
//   shadowRadius: 10,
//   elevation: 10,
// },

// footerButton: {
//   alignItems: "center",
//   flex: 1,
// },

// iconWrapper: {
//   width: 50,
//   height: 50,
//   borderRadius: 25,
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "#2a2a2a",
//   marginBottom: 5,
//   transitionDuration: "200ms",
// },

// activeIconWrapper: {
//   backgroundColor: "#26d0ce",
//   shadowColor: "#26d0ce",
//   shadowOffset: { width: 0, height: 5 },
//   shadowOpacity: 0.5,
//   shadowRadius: 10,
//   elevation: 8,
// },

// footerText: {
//   fontSize: 12,
//   color: "#888",
//   fontWeight: "600",
// },

// activeText: {
//   color: "#fff",
//   fontWeight: "700",
// },

// cartBadge: {
//   position: "absolute",
//   top: -5,
//   right: -5,
//   backgroundColor: "#ff3b30",
//   borderRadius: 10,
//   paddingHorizontal: 6,
//   paddingVertical: 2,
//   justifyContent: "center",
//   alignItems: "center",
// },

// cartCount: {
//   color: "#fff",
//   fontSize: 10,
//   fontWeight: "700",
// },

// });
import React, { useState, useEffect,useContext } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";

// Screens
import SignupScreen from "./Components/Authentication/Signup";
import LoginScreen from "./Components/Authentication/Login";
import HomeScreen from "./Components/Home";
import ProductsScreen from "./Components/Products/ProductsScreen";
import CartScreen from "./Components/Cart/CartScreen";
import CheckoutScreen from "./Components/Cart/CheckoutScreen";
import AddressScreen from "./Components/Cart/AddressScreen";
import PaymentScreen from "./Components/Cart/PaymentScreen";
import Categories from "./Components/Categories/Categories";
import Subcategories from "./Components/Categories/Subcategories";
import Products from "./Components/Categories/Products";
import SearchScreen from "./Components/Products/SearchScreen";
import SplashScreen from "./Components/SplashScreens/SplashScreen";
import SplashScreen1 from "./Components/SplashScreens/SplashScreen1";
import SplashScreen2 from "./Components/SplashScreens/SplashScreen2";
import SplashScreen3 from "./Components/SplashScreens/SplashScreen3";
import SplashScreen4 from "./Components/SplashScreens/SplashScreen4";
import SplashScreen5 from "./Components/SplashScreens/SplashScreen5";


import ServiceBookingForm from "./Components/Services/ServiceBookingForm";
import UserDetailsScreen from "./Components/Cart/UserDetailsScreen";
import UserScreen from "./Components/User/UserScreen";
import AccountDetailScreen from "./Components/User/AccountDetailScreen";
import CustomerSupportScreen from "./Components/User/CustomerSupportScreen";
import FAQ from "./Components/User/FAQ";
import Services from "./Components/Services/Services";
import About from "./Components/User/About";
import StripePayment from "./Components/Cart/StripePayment";
import LogoutScreen from "./Components/User/LogoutScreen";

import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const stripeKey = Constants.expoConfig.extra.stripePublishableKey;

import { colors } from "./Components/Themes/colors";
import { CartContext } from "./src/ContextApis/cartContext";
import { CartProvider } from "./src/ContextApis/cartContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------ Main Layout ------------------
const MainLayout = ({ navigation, children, currentScreen }) => {
 const { cartCount, fetchCartCount } = useContext(CartContext);
 console.log("cart count in app.js",cartCount)
 // Fetch cart count whenever this layout mounts or becomes active
  useEffect(() => {
    fetchCartCount();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <View style={[styles.header, { backgroundColor: colors.headerbg }]}>
           <View style={styles.logoWrapper}>
            <Image
              source={require("./assets/logo.png")}
              style={styles.logo}
              resizeMode="cover" // fills container
            />
          </View>
         
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: colors.white }]}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Text style={[styles.searchText, { color: colors.mutedText }]}>Search...</Text>
          <Icon name="search" size={20} color={colors.mutedText} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        {[
          { name: "Home", icon: "home" },
          { name: "Products", icon: "shopping-bag" },
          { name: "Cart", icon: "shopping-cart" },
          { name: "Services", icon: "build" },
          { name: "Profile", icon: "person" },
        ].map(({ name, icon }) => {
          const isActive = currentScreen === name;
          return (
            <TouchableOpacity
              key={name}
              style={styles.footerButton}
              onPress={() => navigation.navigate(name)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isActive ? colors.gradients.mintGlow : [colors.secondary, colors.secondary]}
                style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}
              >
                <Icon
                  name={icon}
                  size={20}
                  color={isActive ? colors.text : colors.mutedText}
                />
              </LinearGradient>
              <Text style={[styles.footerText, isActive && styles.activeText]}>
                {name}
              </Text>

              {/* Cart Badge */}
              {name === "Cart" && cartCount > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: colors.error }]}>
                  <Text style={styles.cartCount}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ------------------ Bottom Tabs ------------------
const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Home">
            <HomeScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Products">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Products">
            <ProductsScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Cart">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Cart">
            <CartScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Services">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Services">
            <Services />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Profile">
            <UserScreen />
          </MainLayout>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};


export const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: colors.cardsbackground, borderBottomWidth: 1, borderColor: colors.border
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold",
  },
};


// ------------------ App ------------------
const App = () => {
  const [userId, setUserId] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isSplash1Visible, setIsSplash1Visible] = useState(true);
  const [isSplash2Visible, setIsSplash2Visible] = useState(null);
  const [isSplash3Visible, setIsSplash3Visible] = useState(null);
  const [isSplash4Visible, setIsSplash4Visible] = useState(null);
  const [isSplash5Visible, setIsSplash5Visible] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync("refreshToken");
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("login data in app.js",token,storedUserId)
        if (token && storedUserId) {
          setUserId(storedUserId);
          setIsSplash2Visible(false);
          setIsSplash3Visible(false);
          setIsSplash4Visible(false);
          setIsSplash5Visible(false);
        } else {
          setIsSplash2Visible(true);
          setIsSplash3Visible(false);
          setIsSplash4Visible(false);
          setIsSplash5Visible(false);
        }
      } catch (error) {
        console.error("Error checking login:", error);
      } finally {
        setCheckingLogin(false);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const splashFlow = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsSplash1Visible(false);
    };
    splashFlow();
  }, []);

  if (isSplash1Visible) return <SplashScreen1 />;
  if (isSplash2Visible) return <SplashScreen2 onNext={() => { setIsSplash2Visible(false); setIsSplash3Visible(true); }} />;
  if (isSplash3Visible) return <SplashScreen3 onNext={() => { setIsSplash3Visible(false); setIsSplash4Visible(true); }} />;
  if (isSplash4Visible) return <SplashScreen4 onNext={() => { setIsSplash4Visible(false); setIsSplash5Visible(true); }} />;
  if (isSplash5Visible) return <SplashScreen5 onNext={() => setIsSplash5Visible(false)} />;
  if (checkingLogin) return <SplashScreen />;
  return (
    <StripeProvider publishableKey={stripeKey} merchantDisplayName="Basit Sanitary App">
      <CartProvider>

     
      <NavigationContainer>
        <Stack.Navigator initialRouteName={userId ? "Main" : "Login"}>
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} setUserId={setUserId} />}
          </Stack.Screen>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {(props) => <BottomTabs {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout", ...commonHeaderOptions, }} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ title: "Payment Methods", ...commonHeaderOptions, }}/>
          <Stack.Screen name="Profile" component={UserScreen} options={{ title: "Profile" }} />
          <Stack.Screen name="Categories" component={Categories} />
          <Stack.Screen name="Subcategories" component={Subcategories} options={{ title: "SubCategories", ...commonHeaderOptions, }}/>
          <Stack.Screen name="Products" component={Products} options={{ title: "Products", ...commonHeaderOptions, }}/>
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: "Search Products", ...commonHeaderOptions, }} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{ title: "Confirm Order", ...commonHeaderOptions, }}/>
           <Stack.Screen name="bookplumber" component={ServiceBookingForm} options={{ title: "Book Plumber", ...commonHeaderOptions, }}/>
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ title: "Profile Update", ...commonHeaderOptions, }}/>
          <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} options={{ title: "Customer Support", ...commonHeaderOptions, }}/>
          <Stack.Screen name="faq" component={FAQ} options={{ title: "FAQs", ...commonHeaderOptions, }}/>
          <Stack.Screen name="about" component={About} options={{ title: "About Us", ...commonHeaderOptions, }}/>
          <Stack.Screen name="StripePayment" component={StripePayment} options={{ title: "Card Payment", ...commonHeaderOptions, }}/>
          <Stack.Screen name="Logout" component={LogoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
       </CartProvider>
    </StripeProvider>
  );
};

export default App;

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 15,
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: { width: 100, height: 40, resizeMode: "contain" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 20,
    height: 35,
    width: "50%",
  },
  searchText: { flex: 1, fontSize: 14 },
  searchIcon: { marginLeft: 5 },
  body: { flex: 1, padding: 0 },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    borderRadius: 35,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: colors.headerbg,
  },

  footerButton: { alignItems: "center", flex: 1 },

  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
    marginBottom: 5,
  },
  activeIconWrapper: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },

  footerText: { fontSize: 12, color: colors.mutedText, fontWeight: "600" },
  activeText: { color: colors.white, fontWeight: "700" },

  cartBadge: {
    position: "absolute",
    top: -0,
    right: -0,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cartCount: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
});

