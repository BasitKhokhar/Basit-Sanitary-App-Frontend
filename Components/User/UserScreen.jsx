// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   RefreshControl,
//   Modal,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";
// import SocialIconsRow from "./SocialIconsRow";
// import Loader from "../Loader/Loader";
// import Constants from "expo-constants";
// import { colors } from "../Themes/colors";
// import { apiFetch } from "../../src/apiFetch";
// import * as Linking from "expo-linking";
// import * as SecureStore from "expo-secure-store";

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const UserScreen = () => {
//   const [userData, setUserData] = useState(null);
//   const [userImage, setUserImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showLoader, setShowLoader] = useState(false);

//   const navigation = useNavigation();

//   const fetchUserData = async () => {
//     try {
//       const storedUserId = await AsyncStorage.getItem("userId");

//       if (storedUserId) {
//         const response = await apiFetch(`/users/getuserdetails`);
//         const data = await response.json();
//         setUserData(data);

//         const imageResponse = await apiFetch(
//           `/users/user_images`
//         );
//         if (imageResponse.ok) {
//           const imageData = await imageResponse.json();
//           setUserImage(imageData.image_url);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchUserData();
//     setRefreshing(false);
//   };

//   const handleOpenPdf = async (id) => {
//     setShowLoader(true);
//     const res = await apiFetch(`/content/pdf-files/${id}`);
//     if (res?.url) {
//       setShowLoader(false);
//       Linking.openURL(res.url);
//     } else {
//       alert("PDF not found");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.multiRemove([
//         "userId",
//         "email",
//         "hasSeenGuide",
//         "hasSeenSearchHeaderTour",
//       ]);
//       await SecureStore.deleteItemAsync("accessToken");
//       await SecureStore.deleteItemAsync("refreshToken");

//       setShowLogoutModal(false);

//       navigation.reset({
//         index: 0,
//         routes: [{ name: "Login" }],
//       });
//     } catch (error) {
//       console.log("Logout Error:", error);
//     }
//   };


  

//   return (
//     <View style={styles.mainContainer}>
//       {/* Loader while opening PDF */}
//       {showLoader && (
//         <View style={styles.loaderOverlay}>
//           <View style={styles.loaderBox}>
//             <Loader />
//             <Text style={{ color: colors.text, marginTop: 10 }}>
//               Please wait...
//             </Text>
//           </View>
//         </View>
//       )}

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
      
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//          showsVerticalScrollIndicator={false} 
//       >
//         {loading ? (
//           <View style={styles.loaderContainer}>
//             <Loader />
//           </View>
//         ) : userData ? (
//           <View style={styles.profileContainer}>
//             {/* Profile Header */}
//             <View style={styles.header}>
//               <Text style={[styles.title, { color: colors.text }]}>
//                 {userData.name}
//               </Text>
//               <View style={styles.imageContainer}>
//                 {userImage && userImage.startsWith("http") ? (
//                   <Image
//                     source={{ uri: userImage }}
//                     style={styles.profileImage}
//                     onError={() => setUserImage(null)}
//                   />
//                 ) : (
//                   <View
//                     style={[
//                       styles.defaultProfileCircle,
//                       {
//                         borderColor: colors.text,
//                         backgroundColor: colors.white,
//                       },
//                     ]}
//                   />
//                 )}
//               </View>
//             </View>

//             {/* Navigation Sections */}
//             {[
//               { label: "Account Detail", icon: "person", navigate: "AccountDetail" },
//               { label: "Customer Support", icon: "support-agent", navigate: "CustomerSupport" },
              
//               { label: "FAQs", icon: "help-outline", navigate: "faq" },
              
//             ].map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[styles.section, { borderBottomColor: colors.border }]}
//                 onPress={() => navigation.navigate(item.navigate, { userData })}
//               >
//                 <View style={styles.sectionRow}>
//                   <Icon name={item.icon} size={24} color={colors.text} />
//                   <Text style={[styles.sectionText, { color: colors.text }]}>
//                     {item.label}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             ))}

//             {/* PDF Buttons */}
//             <TouchableOpacity
//               style={[styles.section, { borderBottomColor: colors.border }]}
//               onPress={() => handleOpenPdf(1)}
//             >
//               <View style={styles.sectionRow}>
//                 <Icon name="info-outline" size={24} color={colors.text} />
//                 <Text style={[styles.sectionText, { color: colors.text }]}>
//                   About App
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.section, { borderBottomColor: colors.border }]}
//               onPress={() => handleOpenPdf(2)}
//             >
//               <View style={styles.sectionRow}>
//                 <Icon name="security" size={24} color={colors.text} />
//                 <Text style={[styles.sectionText, { color: colors.text }]}>
//                   Privacy Policy
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             {/* Logout */}
//             <TouchableOpacity
//               style={styles.section}
//               onPress={() => setShowLogoutModal(true)}
//             >
//               <View style={styles.sectionRow}>
//                 <Icon name="logout" size={24} color={colors.error} />
//                 <Text style={[styles.sectionText, { color: colors.error }]}>
//                   Logout
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             {/* Social Icons */}
//             <View style={styles.iconsContainer}>
//               <SocialIconsRow />
//             </View>

//             {/* Logout Modal */}
//             <Modal transparent visible={showLogoutModal} animationType="fade">
//               <View style={styles.modalOverlay}>
//                 <View style={styles.modalContent}>
//                   <Text style={styles.modalTitle}>Confirm Logout</Text>
//                   <Text style={styles.modalMessage}>
//                     Are you sure you want to logout?
//                   </Text>
//                   <View style={styles.modalButtons}>
//                     <TouchableOpacity
//                       style={[styles.modalBtn, { backgroundColor: colors.border }]}
//                       onPress={() => setShowLogoutModal(false)}
//                     >
//                       <Text style={{ color: colors.text }}>Cancel</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={[styles.modalBtn, { backgroundColor: colors.error }]}
//                       onPress={handleLogout}
//                     >
//                       <Text style={{ color: colors.white }}>Logout</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </Modal>
//           </View>
//         ) : (
//           <Text style={[styles.text, { color: colors.mutedText }]}>
//             No user data found.
//           </Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// // -----------------------
// // STYLES
// // -----------------------
// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: colors.headerbg,
//     paddingTop: 30,
//   },
//   scrollContent: {
 
//     padding: 16,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingBottom:20,
//     backgroundColor: colors.bodybackground,
//   },
//   loaderContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     height: 300,
//   },
//   profileContainer: {
//     width: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 15,
//     marginBottom: 50,
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   title: { fontSize: 26, fontWeight: "bold" },
//   section: {
//     width: "100%",
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//   },
//   sectionRow: { flexDirection: "row", alignItems: "center" },
//   icon: { marginRight: 10 },
//   sectionText: { fontSize: 18 },
//   text: { fontSize: 18, marginVertical: 5 },
//   iconsContainer: { marginTop: 20,marginBottom:100 },

//   // Image
//   imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
//   profileImage: { width: "100%", height: "100%", borderRadius: 50 },
//   defaultProfileCircle: { width: 50, height: 50, borderRadius: 50, borderWidth: 2 },

//   // Loader overlay
//   loaderOverlay: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#00000080",
//     zIndex: 999,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loaderBox: {
//     backgroundColor: colors.cardsbackground,
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//   },

//   // Logout Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "#00000060",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "80%",
//     padding: 20,
//     borderRadius: 12,
//     backgroundColor: colors.cardsbackground,
//   },
//   modalTitle: { fontSize: 20, fontWeight: "bold", color: colors.text },
//   modalMessage: { fontSize: 16, marginTop: 10, color: colors.text },
//   modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
//   modalBtn: { width: "45%", padding: 12, borderRadius: 8, alignItems: "center" },
// });

// export default UserScreen;
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

  // Fetch User Data
  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedUserId) {
        const response = await apiFetch(`/users/getuserdetails`);
        const data = await response.json();
        setUserData(data);

        const imageResponse = await apiFetch(`/users/user_images`);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleOpenPdf = async (id) => {
    setShowLoader(true);
    const res = await apiFetch(`/content/pdf-files/${id}`);

    if (res?.url) {
      setShowLoader(false);
      Linking.openURL(res.url);
    } else {
      setShowLoader(false);
      alert("PDF not found");
    }
  };

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
    <View style={styles.mainContainer}>
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
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        ) : (
          <View style={styles.profileContainer}>
            {/* Profile Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                {userData?.name || "Guest User"}
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

            {/* Navigation Sections (Always Visible) */}
            {[
              { label: "Account Detail", icon: "person", navigate: "AccountDetail" },
              {
                label: "Customer Support",
                icon: "support-agent",
                navigate: "CustomerSupport",
              },
              { label: "FAQs", icon: "help-outline", navigate: "faq" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.section, { borderBottomColor: colors.border }]}
                onPress={() => navigation.navigate(item.navigate, { userData })}
              >
                <View style={styles.sectionRow}>
                  <Icon name={item.icon} size={24} color={colors.text} />
                  <Text style={[styles.sectionText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* PDF Buttons */}
            <TouchableOpacity
              style={[styles.section, { borderBottomColor: colors.border }]}
              onPress={() => handleOpenPdf(1)}
            >
              <View style={styles.sectionRow}>
                <Icon name="info-outline" size={24} color={colors.text} />
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
                <Icon name="security" size={24} color={colors.text} />
                <Text style={[styles.sectionText, { color: colors.text }]}>
                  Privacy Policy
                </Text>
              </View>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => setShowLogoutModal(true)}
            >
              <View style={styles.sectionRow}>
                <Icon name="logout" size={24} color={colors.error} />
                <Text style={[styles.sectionText, { color: colors.error }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>

            {/* Social Icons */}
            <View style={styles.iconsContainer}>
              <SocialIconsRow />
            </View>

            {/* Logout Modal */}
            <Modal transparent visible={showLogoutModal} animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Confirm Logout</Text>
                  <Text style={styles.modalMessage}>
                    Are you sure you want to logout?
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[
                        styles.modalBtn,
                        { backgroundColor: colors.border },
                      ]}
                      onPress={() => setShowLogoutModal(false)}
                    >
                      <Text style={{ color: colors.text }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modalBtn,
                        { backgroundColor: colors.error },
                      ]}
                      onPress={handleLogout}
                    >
                      <Text style={{ color: colors.white }}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// -----------------------
// STYLES
// -----------------------
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.headerbg,
    paddingTop: 30,
  },
  scrollContent: {
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 20,
    backgroundColor: colors.bodybackground,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 300,
  },
  profileContainer: { width: "100%" },
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
  sectionText: { fontSize: 18 },
  iconsContainer: { marginTop: 20, marginBottom: 100 },

  // Image
  imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
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
  modalMessage: { fontSize: 16, marginTop: 10, color: colors.text },
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
