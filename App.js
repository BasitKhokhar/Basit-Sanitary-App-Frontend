
import AppContainer from "./src/AppContainer";
import React, { useState, useEffect, useContext } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { View, Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";

// Screens
import SignupScreen from "./src/components/Authentication/Signup";
import LoginScreen from "./src/components/Authentication/Login";
import AllNotifications from "./src/Screens/SplashScreens/AllNotifications";
import HomeScreen from "./src/components/Home";
import ProductsScreen from "./src/components/Products/ProductsScreen";
import CartScreen from "./src/components/Cart/CartScreen";
import CheckoutScreen from "./src/components/Cart/CheckoutScreen";
import AddressScreen from "./src/components/Cart/AddressScreen";
import Categories from "./src/components/Categories/Categories";
import Subcategories from "./src/components/Categories/Subcategories";
import Products from "./src/components/Categories/Products";
import SearchScreen from "./src/components/Products/SearchScreen";
import SplashScreen from "./src/components/SplashScreens/SplashScreen";
import SplashScreen1 from "./src/components/SplashScreens/SplashScreen1";
import SplashScreen2 from "./src/components/SplashScreens/SplashScreen2";
import SplashScreen3 from "./src/components/SplashScreens/SplashScreen3";
import SplashScreen4 from "./src/components/SplashScreens/SplashScreen4";
import SplashScreen5 from "./src/components/SplashScreens/SplashScreen5";


import ServiceBookingForm from "./src/components/Services/ServiceBookingForm";
import UserDetailsScreen from "./src/components/Cart/UserDetailsScreen";
import UserScreen from "./src/components/User/UserScreen";
import AccountDetailScreen from "./src/components/User/AccountDetailScreen";
import CustomerSupportScreen from "./src/components/User/CustomerSupportScreen";
import FAQ from "./src/components/User/FAQ";
import Services from "./src/components/Services/Services";
import About from "./src/components/User/About";
import StripePayment from "./src/components/Cart/StripePayment";
import LogoutScreen from "./src/components/User/LogoutScreen";
import WishlistScreen from "./src/components/Wishlist/WishlistScreen";
import OrdersScreen from "./src/components/Orders/OrdersScreen";
import OrderDetailScreen from "./src/components/Orders/OrderDetailScreen";

import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const stripeKey = Constants.expoConfig.extra.stripePublishableKey;

import { theme } from "./src/theme";
import { colors } from "./src/theme/colors";
import { CartContext } from "./src/ContextApis/cartContext";
import { CartProvider } from "./src/ContextApis/cartContext";
import { NotificationProvider } from "./src/ContextApis/NotificationsContext";
import { useNotification } from "./src/ContextApis/NotificationsContext";
import { WishlistProvider, useWishlist } from "./src/ContextApis/WishlistContext";
import ErrorBoundary from "./src/components/ErrorBoundary";
import TabBar from "./src/components/navigation/TabBar";
import PressableScale from "./src/components/ui/PressableScale";
import AppText from "./src/components/ui/Text";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------ Premium Header Action ------------------
const HeaderAction = ({ icon, onPress, badge, gradient }) => (
  <PressableScale onPress={onPress} style={styles.headerBtn} accessibilityLabel={icon}>
    {gradient ? (
      <LinearGradient
        colors={colors.gradients.emeraldGlow}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBtnGradient}
      >
        <Icon name={icon} size={20} color={colors.text.onPrimary} />
      </LinearGradient>
    ) : (
      <View style={styles.headerBtnPlain}>
        <Icon name={icon} size={20} color={colors.text.onPrimary} />
      </View>
    )}
    {badge > 0 ? (
      <View style={styles.headerBadge}>
        <AppText variant="micro" weight="800" style={{ color: colors.text.onPrimary }}>
          {badge > 99 ? "99+" : badge}
        </AppText>
      </View>
    ) : null}
  </PressableScale>
);

// ------------------ Main Layout ------------------
const MainLayout = ({ navigation, children, currentScreen }) => {
  const { cartCount, fetchCartCount } = useContext(CartContext);
  const { unreadCount } = useNotification();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.inverse }]}>
      {/* Premium dark header — white logo reads clearly on the dark surface.
          Vertical gradient ending in pure `ink` so the bottom edge matches the
          top of any screen's hero gradient (Services, etc.) seamlessly. */}
      <LinearGradient
        colors={[colors.palette.ink2, colors.palette.ink]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.header}
      >
        <View style ={{ width: 90, height: 50, paddingHorizontal: 5, borderRadius: theme.radius.md,}}>
<Image source={require("./assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
        

        {/* <PressableScale
          style={styles.searchBar}
          onPress={() => navigation.navigate("SearchScreen")}
          accessibilityLabel="Search products"
          scaleTo={0.98}
        >
          <Icon name="search" size={18} color={colors.text.muted} />
          <AppText variant="body" color="muted" style={{ marginLeft: 6 }}>
            Search products…
          </AppText>
        </PressableScale> */}
         <View style={{ flexDirection: "row", gap: 12, }}>
 <HeaderAction icon="favorite-border" onPress={() => navigation.navigate("Wishlist")} badge={wishlistCount} />
        <HeaderAction icon="notifications-none" onPress={() => navigation.navigate("allNotifications")} badge={unreadCount} gradient />
         </View>
       
      </LinearGradient>

      <View style={styles.body}>{children}</View>

      <TabBar current={currentScreen} onNavigate={(name) => navigation.navigate(name)} cartCount={cartCount} />
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
  headerStyle: { backgroundColor: colors.bg.inverse, shadowColor: "transparent", elevation: 0 },
  headerTintColor: colors.text.onPrimary,
  headerTitleStyle: { fontWeight: "700" },
  ...TransitionPresets.SlideFromRightIOS,
};

// ------------------ App ------------------
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isSplash1Visible, setIsSplash1Visible] = useState(true);
  const [isSplash2Visible, setIsSplash2Visible] = useState(null);
  const [isSplash3Visible, setIsSplash3Visible] = useState(null);
  const [isSplash4Visible, setIsSplash4Visible] = useState(null);
  const [isSplash5Visible, setIsSplash5Visible] = useState(null);

  // OTA updates: fetch and apply while the splash screen is showing, so a
  // published `eas update` lands on this launch instead of the next one.
  useEffect(() => {
    const applyOtaUpdate = async () => {
      if (__DEV__ || !Updates.isEnabled) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        // Offline or update server unreachable — keep the installed bundle.
      }
    };
    applyOtaUpdate();
  }, []);

  // ✅ Check for valid token only
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync("refreshToken");

        if (token) {
          setIsLoggedIn(true);
          setIsSplash2Visible(false);
          setIsSplash3Visible(false);
          setIsSplash4Visible(false);
          setIsSplash5Visible(false);
        } else {
          setIsLoggedIn(false);
          setIsSplash2Visible(true);
          setIsSplash3Visible(false);
          setIsSplash4Visible(false);
          setIsSplash5Visible(false);
        }
      } catch (error) {
        if (__DEV__) console.error("Error checking login:", error);
        setIsLoggedIn(false);
      } finally {
        setCheckingLogin(false);
      }
    };

    checkLogin();
  }, []);

  // Splash screen flow
  useEffect(() => {
    const splashFlow = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsSplash1Visible(false);
    };
    splashFlow();
  }, []);

  const finishOnboarding = () => {
    setIsSplash2Visible(false);
    setIsSplash3Visible(false);
    setIsSplash4Visible(false);
    setIsSplash5Visible(false);
  };

  if (isSplash1Visible)
    return (
      <AppContainer backgroundColor={colors.palette.emerald900}>
        <SplashScreen1 />
      </AppContainer>
    );

  if (isSplash2Visible)
    return (
      <AppContainer backgroundColor={colors.bg.inverse}>
        <SplashScreen2
          onNext={() => {
            setIsSplash2Visible(false);
            setIsSplash3Visible(true);
          }}
          onSkip={finishOnboarding}
        />
      </AppContainer>
    );

  if (isSplash3Visible)
    return (
      <AppContainer backgroundColor={colors.bg.inverse}>
        <SplashScreen3
          onNext={() => {
            setIsSplash3Visible(false);
            setIsSplash4Visible(true);
          }}
          onSkip={finishOnboarding}
        />
      </AppContainer>
    );

  if (isSplash4Visible)
    return (
      <AppContainer backgroundColor={colors.bg.inverse}>
        <SplashScreen4
          onNext={() => {
            setIsSplash4Visible(false);
            setIsSplash5Visible(true);
          }}
          onSkip={finishOnboarding}
        />
      </AppContainer>
    );

  if (isSplash5Visible)
    return (
      <AppContainer backgroundColor={colors.bg.inverse}>
        <SplashScreen5 onNext={() => setIsSplash5Visible(false)} />
      </AppContainer>
    );

  if (checkingLogin)
    return (
      <AppContainer backgroundColor={colors.bg.inverse}>
        <SplashScreen />
      </AppContainer>
    );


  return (
    <AppContainer backgroundColor={colors.bg.inverse} barStyle="light-content">
      <ErrorBoundary>
        <StripeProvider publishableKey={stripeKey} merchantDisplayName="Basit Sanitary App">
          <NotificationProvider>
            <CartProvider>
              <WishlistProvider>
                <NavigationContainer>
                  <Stack.Navigator
                    initialRouteName={isLoggedIn ? "Main" : "Login"}
                    screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
                  >
                    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" options={{ headerShown: false }}>
                      {(props) => <LoginScreen {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="Main" options={{ headerShown: false }}>
                      {(props) => <BottomTabs {...props} />}
                    </Stack.Screen>

                    {/* Other Screens */}
                    <Stack.Screen name="allNotifications" component={AllNotifications} options={{ title: "All Notifications", ...commonHeaderOptions }} />
                    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout", ...commonHeaderOptions }} />
                    <Stack.Screen name="AddressScreen" component={AddressScreen} options={{ ...commonHeaderOptions }} />
                    <Stack.Screen name="Profile" component={UserScreen} options={{ title: "Profile", ...commonHeaderOptions }} />
                    <Stack.Screen name="Categories" component={Categories} options={{ ...commonHeaderOptions }} />
                    <Stack.Screen name="Subcategories" component={Subcategories} options={{ title: "SubCategories", ...commonHeaderOptions }} />
                    <Stack.Screen name="Products" component={Products} options={{ title: "Products", ...commonHeaderOptions }} />
                    <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: "Search Products", ...commonHeaderOptions }} />
                    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{ title: "Confirm Order", ...commonHeaderOptions }} />
                    <Stack.Screen name="bookplumber" component={ServiceBookingForm} options={{ title: "Book Plumber", ...commonHeaderOptions }} />
                    <Stack.Screen name="User" component={UserScreen} options={{ ...commonHeaderOptions }} />
                    <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ title: "Profile Update", ...commonHeaderOptions }} />
                    <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} options={{ title: "Customer Support", ...commonHeaderOptions }} />
                    <Stack.Screen name="faq" component={FAQ} options={{ title: "FAQs", ...commonHeaderOptions }} />
                    <Stack.Screen name="about" component={About} options={{ title: "About Us", ...commonHeaderOptions }} />
                    <Stack.Screen name="StripePayment" component={StripePayment} options={{ title: "Card Payment", ...commonHeaderOptions }} />
                    <Stack.Screen name="Logout" component={LogoutScreen} options={{ ...commonHeaderOptions }} />
                    <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: "My Wishlist", ...commonHeaderOptions }} />
                    <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "My Orders", ...commonHeaderOptions }} />
                    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: "Order Details", ...commonHeaderOptions }} />
                  </Stack.Navigator>
                </NavigationContainer>
              </WishlistProvider>
            </CartProvider>
          </NotificationProvider>
        </StripeProvider>
      </ErrorBoundary>
    </AppContainer>
  );
};

export default App;

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.space["4xl"],
    paddingBottom: theme.space.lg,
    paddingHorizontal: theme.space.lg,
    gap: theme.space.sm,
    backgroundColor: colors.bg.inverse,
  },
  logo: { width: "100% ", height: "100%",  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.lg,
    backgroundColor: colors.bg.surface,
    ...theme.shadow.e1,
  },
  headerBtn: { width: 42, height: 42 },
  headerBtnGradient: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadow.brand,
  },
  headerBtnPlain: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: colors.status.error,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.bg.inverse,
  },
  body: { flex: 1, backgroundColor: colors.bg.canvas },
});
