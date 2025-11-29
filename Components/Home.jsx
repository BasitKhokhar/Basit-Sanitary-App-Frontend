
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import OnSaleProducts from "./Products/OnSaleProducts";
import Completesets from "./Products/Completesets";
import TrendingProducts from "./Products/TrendingProducts";
import ShopLocation from "./Services/ShopLocation";
import Categories from "./Categories/Categories";
import ImageSlider from "./Sliders/Slider";
import UserNameDisplay from "./User/UserNameDisplay";
import BrandSlider from "./Sliders/BrandSlider";
import CustomerSupportoptions from "./User/CustomerSupportoptions";
import Loader from "./Loader/Loader";
import Constants from "expo-constants";
import { apiFetch } from "../src/apiFetch";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const HomeScreen = ({ navigation }) => {
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

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({ headerShown: false });
    }
  }, []);

  // ⭐ Updated: fetch using apiFetch
  const fetchData = async () => {
    try {
      const endpoints = [
        { key: "sliderData", url: "/content/sliderimages" },
        { key: "categoryData", url: "/products/categories" },
        { key: "onSaleProducts", url: "/products/onsale" },
        { key: "brandData", url: "/content/brands" },
        { key: "trendingProducts", url: "/products/trending" },
        { key: "completeSets", url: "/products/complete_accessory_sets" },
        { key: "firstColumnData", url: "/content/first_column_data" },
        { key: "secondColumnData", url: "/content/second_column_data" },
      ];

      const responses = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const res = await apiFetch(endpoint.url, {}, navigation);
            const data = await res.json();
            return { key: endpoint.key, data };
          } catch {
            return { key: endpoint.key, data: [] };
          }
        })
      );

      const updated = responses.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});

      setHomeData(updated);
    } catch (error) {
      console.error("Home data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      handleRefresh();
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  const sections = [
    { key: "user", render: () => <UserNameDisplay /> },
    { key: "slider", render: () => <ImageSlider sliderData={homeData.sliderData} /> },
    { key: "categories", render: () => <Categories categoriesData={homeData.categoryData} /> },
    { key: "onSale", render: () => <OnSaleProducts products={homeData.onSaleProducts} /> },
    { key: "brands", render: () => <BrandSlider brands={homeData.brandData} /> },
    {
      key: "trending",
      render: () => (
        <>
          <Text style={styles.sectionTitle}>Trending Products</Text>
          <TrendingProducts products={homeData.trendingProducts} />
        </>
      ),
    },
    {
      key: "completeSets",
      render: () => <Completesets sets={homeData.completeSets} />,
    },
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
      initialNumToRender={2}
      windowSize={5}
      maxToRenderPerBatch={3}
      updateCellsBatchingPeriod={100}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 120,
    backgroundColor: "#F8F9FA",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
