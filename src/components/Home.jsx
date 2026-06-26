import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ShopLocation from "./Services/ShopLocation";
import Categories from "./Categories/Categories";
import ImageSlider from "./Sliders/Slider";
import UserNameDisplay from "./User/UserNameDisplay";
import BrandSlider from "./Sliders/BrandSlider";
import CustomerSupportoptions from "./User/CustomerSupportoptions";
import { apiFetch } from "../src/apiFetch";

import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../src/ContextApis/cartContext";
import { useWishlist } from "../src/ContextApis/WishlistContext";
import { endpoints } from "../src/services/endpoints";
import ProductCarousel from "../src/components/commerce/ProductCarousel";
import { Skeleton } from "../src/components/ui/Skeleton";
import AppText from "../src/components/ui/Text";
import { colors } from "../src/theme/colors";
import { space } from "../src/theme/spacing";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { fetchCartCount } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAddToCart = async (product) => {
    try {
      await apiFetch(endpoints.cart.add, {
        method: "POST",
        body: JSON.stringify({ ...product, quantity: 1, selectedColor: "None" }),
      });
      fetchCartCount();
    } catch (e) {
      if (__DEV__) console.warn("add to cart failed", e);
    }
  };

  const carouselProps = {
    onAddToCart: handleAddToCart,
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
          <ProductCarousel title="Complete Sets" subtitle="Curated bathroom collections" data={homeData.completeSets} {...carouselProps} />
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
  );
};

const styles = StyleSheet.create({
  listContainer: { paddingBottom: 120, backgroundColor: colors.bg.canvas },
  skeletonWrap: { flex: 1, padding: space.lg, backgroundColor: colors.bg.canvas },
  skelRow: { flexDirection: "row", justifyContent: "space-between", marginTop: space.lg },
});

export default HomeScreen;
