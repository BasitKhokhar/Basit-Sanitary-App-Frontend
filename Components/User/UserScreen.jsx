import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import SocialIconsRow from "./SocialIconsRow";
import Loader from "../Loader/Loader";
import Constants from "expo-constants";
import { colors } from "../Themes/colors";
import { apiFetch } from "../../src/apiFetch";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserScreen = () => {
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedUserId) {
        const response = await apiFetch(`/users/${storedUserId}`);
        const data = await response.json();
        setUserData(data);

        const imageResponse = await apiFetch(
          `/users/user_images/${storedUserId}`
        );
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setUserImage(imageData.image_url);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
    setRefreshing(false);
  };

  // -------------------------------
  // 📌 OPEN PDF HANDLER
  // -------------------------------
 const handleOpenPdf = async (id) => {
  try {
    setShowLoader(true);
    const token = await SecureStore.getItemAsync("accessToken");

    const res = await fetch(`${API_BASE_URL}/content/pdf-files/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text(); // raw HTML error
      console.error("PDF fetch error:", text);
      setShowLoader(false);
      alert(`Failed to open PDF: ${res.status}`);
      return;
    }

    const data = await res.json();
    setShowLoader(false);

    if (data?.url) {
      Linking.openURL(data.url);
    } else {
      alert("PDF URL not found");
    }
  } catch (err) {
    setShowLoader(false);
    console.error("Error opening PDF:", err);
  }
};

  // -------------------------------
  // 📌 LOGOUT HANDLER
  // -------------------------------
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userId",
        "email",
        "hasSeenGuide",
        "hasSeenSearchHeaderTour",
      ]);
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");

      setShowLogoutModal(false);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <View style={[styles.maincontainer, { backgroundColor: colors.headerbg }]}>
      {/* Loader while opening PDF */}
      {showLoader && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <Loader />
            <Text style={{ color: colors.text, marginTop: 10 }}>
              Please wait...
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.bodybackground },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View
            style={[
              styles.loaderContainer,
              { backgroundColor: colors.cardsbackground },
            ]}
          >
            <Loader />
          </View>
        ) : userData ? (
          <View style={styles.profileContainer}>
            {/* Profile Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                {userData.name}
              </Text>

              <View style={styles.imageContainer}>
                {userImage && userImage.startsWith("http") ? (
                  <Image
                    source={{ uri: userImage }}
                    style={styles.profileImage}
                    onError={() => setUserImage(null)}
                  />
                ) : (
                  <View
                    style={[
                      styles.defaultProfileCircle,
                      {
                        borderColor: colors.text,
                        backgroundColor: colors.white,
                      },
                    ]}
                  />
                )}
              </View>
            </View>

            {/* Navigation Sections */}
            {[
              {
                label: "Account Detail",
                icon: "person",
                navigate: "AccountDetail",
              },
              {
                label: "Customer Support",
                icon: "support-agent",
                navigate: "CustomerSupport",
              },
              { label: "FAQs", icon: "help-outline", navigate: "faq" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.section,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => navigation.navigate(item.navigate, { userData })}
              >
                <View style={styles.sectionRow}>
                  <Icon
                    name={item.icon}
                    size={24}
                    color={colors.text}
                    style={styles.icon}
                  />
                  <Text style={[styles.sectionText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* NEW BUTTONS (ABOUT APP & PRIVACY POLICY) */}
            <TouchableOpacity
              style={[styles.section, { borderBottomColor: colors.border }]}
              onPress={() => handleOpenPdf(1)}
            >
              <View style={styles.sectionRow}>
                <Icon name="info" size={24} color={colors.text} />
                <Text style={[styles.sectionText, { color: colors.text }]}>
                  About App
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, { borderBottomColor: colors.border }]}
              onPress={() => handleOpenPdf(2)}
            >
              <View style={styles.sectionRow}>
                <Icon name="privacy-tip" size={24} color={colors.text} />
                <Text style={[styles.sectionText, { color: colors.text }]}>
                  Privacy Policy
                </Text>
              </View>
            </TouchableOpacity>

            {/* LOGOUT BUTTON */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => setShowLogoutModal(true)}
            >
              <View style={styles.sectionRow}>
                <Icon
                  name="logout"
                  size={24}
                  color={colors.error}
                  style={styles.icon}
                />
                <Text style={[styles.sectionText, { color: colors.error }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.iconscontainer}>
              <SocialIconsRow />
            </View>

            {/* LOGOUT CONFIRMATION MODAL */}
            <Modal transparent visible={showLogoutModal} animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Confirm Logout</Text>
                  <Text style={styles.modalMessage}>
                    Are you sure you want to logout?
                  </Text>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: colors.border }]}
                      onPress={() => setShowLogoutModal(false)}
                    >
                      <Text style={{ color: colors.text }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: colors.error }]}
                      onPress={handleLogout}
                    >
                      <Text style={{ color: colors.white }}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <Text style={[styles.text, { color: colors.mutedText }]}>
            No user data found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

// -----------------------
// STYLES
// -----------------------
const styles = StyleSheet.create({
  maincontainer: {
    width: "100%",
    height: "100%",
    paddingTop: 30,
  },
  container: {
    flex:1,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  profileContainer: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 50,
    justifyContent: "space-between",
    width: "100%",
  },
  title: { fontSize: 26, fontWeight: "bold" },
  section: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  sectionRow: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 10 },
  sectionText: { fontSize: 18 },
  text: { fontSize: 18, marginVertical: 5 },
  iconscontainer: { marginTop: 20 },

  // Image
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 50 },
  defaultProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
  },

  // Loader overlay
  loaderOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000080",
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: colors.cardsbackground,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  // Logout Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000060",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.cardsbackground,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: colors.text },
  modalMessage: {
    fontSize: 16,
    marginTop: 10,
    color: colors.text,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    width: "45%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default UserScreen;
