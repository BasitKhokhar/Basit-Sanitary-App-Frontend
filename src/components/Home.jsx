import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductModal from "./Products/ProductModal";
import ShopLocation from "./Services/ShopLocation";
import Categories from "./Categories/Categories";
import ImageSlider from "./Sliders/Slider";
import UserNameDisplay from "./User/UserNameDisplay";
import BrandSlider from "./Sliders/BrandSlider";
import CustomerSupportoptions from "./User/CustomerSupportoptions";
import { apiFetch } from "../apiFetch";

import { useNavigation } from "@react-navigation/native";
import { useWishlist } from "../ContextApis/WishlistContext";
import { endpoints } from "../services/endpoints";
import ProductCarousel from "../components/commerce/ProductCarousel";
import { Skeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import AppText from "../components/ui/Text";
import { colors } from "../theme/colors";
import { space } from "../theme/spacing";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [homeData, setHomeData] = useState({
    sliderData: [],
    categoryData: [],
    brandData: [],
    onSaleProducts: [],
    trendingProducts: [],
    completeSets: [],
    firstColumnData: [],
    secondColumnData: [],
  });

  const fetchData = useCallback(async () => {
    try {
      const eps = [
        { key: "sliderData", url: endpoints.content.sliderImages },
        { key: "categoryData", url: endpoints.products.categories },
        { key: "onSaleProducts", url: "/products/onsale" },
        { key: "brandData", url: "/content/brands" },
        { key: "trendingProducts", url: "/products/trending" },
        { key: "completeSets", url: "/products/complete_accessory_sets" },
        { key: "firstColumnData", url: "/content/first_column_data" },
        { key: "secondColumnData", url: "/content/second_column_data" },
      ];

      const responses = await Promise.all(
        eps.map(async (e) => {
          try {
            const res = await apiFetch(e.url, {}, navigation);
            const data = await res.json();
            return { key: e.key, data };
          } catch {
            return { key: e.key, data: [] };
          }
        })
      );

      setHomeData(responses.reduce((acc, { key, data }) => ((acc[key] = data), acc), {}));
    } catch (error) {
      if (__DEV__) console.error("Home data fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    (async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
      } catch (e) {}
    })();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Tapping a card or its cart icon opens the product/cart modal first
  // (where the user picks a finish and confirms) — consistent across the app.
  const openCartModal = (product) => setSelectedProduct(product);

  const carouselProps = {
    onPressItem: openCartModal,
    onAddToCart: openCartModal,
    isWishlisted,
    onToggleWishlist: toggleWishlist,
    onSeeAll: () => navigation.navigate("Products"),
  };

  if (loading) {
    return (
      <View style={styles.skeletonWrap}>
        <Skeleton height={180} style={{ marginBottom: space.lg }} />
        <View style={styles.skelRow}>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} width={64} height={64} rounded={16} />)}
        </View>
        <Skeleton height={220} style={{ marginTop: space.xl }} />
        <Skeleton height={220} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  // If the backend returned nothing for every section (e.g. server down),
  // show a single "No data" fallback instead of a blank screen.
  const hasAnyData = [
    homeData.sliderData,
    homeData.categoryData,
    homeData.brandData,
    homeData.onSaleProducts,
    homeData.trendingProducts,
    homeData.completeSets,
    homeData.firstColumnData,
    homeData.secondColumnData,
  ].some((d) => Array.isArray(d) && d.length > 0);

  if (!hasAnyData) {
    return (
      <View style={styles.emptyWrap}>
        <EmptyState
          icon="cloud-off"
          title="No data"
          subtitle="We couldn't load anything right now. Pull to retry."
          actionLabel="Retry"
          onAction={fetchData}
        />
      </View>
    );
  }

  const sections = [
    { key: "user", render: () => <UserNameDisplay /> },
    { key: "slider", render: () => <ImageSlider sliderData={homeData.sliderData} /> },
    { key: "categories", render: () => <Categories categoriesData={homeData.categoryData} /> },
    {
      key: "onSale",
      render: () =>
        homeData.onSaleProducts?.length ? (
          <ProductCarousel title="On Sale" subtitle="Limited-time premium offers" data={homeData.onSaleProducts} {...carouselProps} />
        ) : null,
    },
    { key: "brands", render: () => <BrandSlider brands={homeData.brandData} /> },
    {
      key: "trending",
      render: () =>
        homeData.trendingProducts?.length ? (
          <ProductCarousel title="Trending Now" subtitle="What customers love" data={homeData.trendingProducts} {...carouselProps} />
        ) : null,
    },
    {
      key: "completeSets",
      render: () =>
        homeData.completeSets?.length ? (
          <ProductCarousel title="Complete Sets" subtitle="Curated bathroom collections" variant="showcase" data={homeData.completeSets} {...carouselProps} />
        ) : null,
    },
    { key: "location", render: () => <ShopLocation /> },
    {
      key: "support",
      render: () => (
        <CustomerSupportoptions
          firstColumnData={homeData.firstColumnData}
          secondColumnData={homeData.secondColumnData}
        />
      ),
    },
  ];

  return (
    <View style={styles.flex}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <View>{item.render()}</View>}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        windowSize={5}
        maxToRenderPerBatch={3}
        updateCellsBatchingPeriod={100}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {selectedProduct && (
        <ProductModal
          userId={userId}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.canvas },
  listContainer: { paddingBottom: 120, backgroundColor: colors.bg.canvas },
  skeletonWrap: { flex: 1, padding: space.lg, backgroundColor: colors.bg.canvas },
  emptyWrap: { flex: 1, backgroundColor: colors.bg.canvas },
  skelRow: { flexDirection: "row", justifyContent: "space-between", marginTop: space.lg },
});

export default HomeScreen;
