// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from "@react-navigation/native";
// import SocialIconsRow from "./SocialIconsRow";
// import Loader from "../Loader/Loader";
// import Constants from 'expo-constants';

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const UserScreen = () => {
//   const [userData, setUserData] = useState(null);
//   const [userImage, setUserImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const navigation = useNavigation();

//   const fetchUserData = async () => {
//     try {
//       const storedUserId = await AsyncStorage.getItem("userId");
//       console.log("User ID in UserScreen is:", storedUserId);
//       if (storedUserId) {

//         const response = await fetch(`${API_BASE_URL}/users/${storedUserId}`);
//         if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
//         const data = await response.json();
//         setUserData(data);

//         const imageResponse = await fetch(`${API_BASE_URL}/user_images/${storedUserId}`);
//         if (imageResponse.ok) {
//           const imageData = await imageResponse.json();
//           console.log("Fetched user image:", imageData.image_url);
//           setUserImage(imageData.image_url);
//         } else {
//           console.log("User image fetch failed.");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching user data or image:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchUserData();
//     setRefreshing(false);
//   };

//   console.log("userImage in UserScreen:", userImage);

//   return (
//     <View style={styles.maincontainer}>
//       <ScrollView
//         contentContainerStyle={styles.container}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {loading ? (
//           <View style={styles.loaderContainer}>
//             <Loader />
//           </View>
//         ) : userData ? (
//           <View style={styles.profileContainer}>
//             {/* Profile Header */}
//             <View style={styles.header}>
//               <Text style={styles.title}>{userData.name}</Text>
//               <View style={styles.imageContainer}>
//                 {userImage && typeof userImage === 'string' && userImage.startsWith('http') ? (
//                   <Image
//                     source={{ uri: userImage }}
//                     style={styles.profileImage}
//                     onError={() => {
//                       console.log("Image load failed, setting fallback.");
//                       setUserImage(null);
//                     }}
//                   />
//                 ) : (
//                   <View style={styles.defaultProfileCircle} />
//                 )}
//               </View>
//             </View>

//             {/* Navigation Sections */}
//             <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("AccountDetail", { userData })}>
//               <View style={styles.sectionRow}>
//                 <Icon name="person" size={24} color="#333" style={styles.icon} />
//                 <Text style={styles.sectionText}>Account Detail</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("CustomerSupport")}>
//               <View style={styles.sectionRow}>
//                 <Icon name="support-agent" size={24} color="#333" style={styles.icon} />
//                 <Text style={styles.sectionText}>Customer Support</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("faq")}>
//               <View style={styles.sectionRow}>
//                 <Icon name="help-outline" size={24} color="#333" style={styles.icon} />
//                 <Text style={styles.sectionText}>FAQs</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("about")}>
//               <View style={styles.sectionRow}>
//                 <Icon name="info" size={24} color="#333" style={styles.icon} />
//                 <Text style={styles.sectionText}>About</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.section, styles.logout]} onPress={() => navigation.navigate("Logout")}>
//               <View style={styles.sectionRow}>
//                 <Icon name="logout" size={24} color="#333" style={styles.icon} />
//                 <Text style={styles.sectionText}>Logout</Text>
//               </View>
//             </TouchableOpacity>

//             <View style={styles.iconscontainer}>
//               <SocialIconsRow />
//             </View>
//           </View>
//         ) : (
//           <Text style={styles.text}>No user data found.</Text>
//         )}
//       </ScrollView>
//     </View>
//   );

// };

// const styles = StyleSheet.create({
//   maincontainer: {
//     backgroundColor: '#1A1A1A',
//     paddingTop: 30,
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     padding: 16,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//     backgroundColor: '#fff',
//   },
//   profileContainer: {
//     width: "100%",
//     height: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 15,
//     marginBottom: 50,
//     justifyContent: "space-between",
//     width: "100%",
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#333"
//   },
//   section: {
//     width: "100%",
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     alignItems: "flex-start"
//   },
//   sectionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   icon: {
//     marginRight: 10,
//   },

//   sectionText: {
//     fontSize: 18,
//     color: "#333"
//   },
//   logout: {
//     borderBottomWidth: 0
//   },
//   text: {
//     fontSize: 18,
//     marginVertical: 5,
//     color: "#555"
//   },
//   iconscontainer: {
//     display: 'flex',
//   },
//   imageContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//     overflow: "hidden"
//   },
//   profileImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 50
//   },
//   defaultProfileCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: "#000",
//     backgroundColor: "#fff"
//   }
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import SocialIconsRow from "./SocialIconsRow";
import Loader from "../Loader/Loader";
import Constants from "expo-constants";
import { colors } from "../Themes/colors"; // ✅ THEME COLORS
import { apiFetch } from "../../src/apiFetch";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserScreen = () => {
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedUserId) {
        const response = await apiFetch(`/users/${storedUserId}`);
        const data = await response.json();
        setUserData(data);

        const imageResponse = await fetch(
          `${API_BASE_URL}/user_images/${storedUserId}`
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

  return (
    <View style={[styles.maincontainer, { backgroundColor: colors.headerbg }]}>
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
                      { borderColor: colors.text, backgroundColor: colors.white },
                    ]}
                  />
                )}
              </View>
            </View>

            {/* Navigation Sections */}
            {[
              { label: "Account Detail", icon: "person", navigate: "AccountDetail" },
              { label: "Customer Support", icon: "support-agent", navigate: "CustomerSupport" },
              { label: "FAQs", icon: "help-outline", navigate: "faq" },
              { label: "About", icon: "info", navigate: "about" },
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
                  <Icon name={item.icon} size={24} color={colors.text} style={styles.icon} />
                  <Text style={[styles.sectionText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => navigation.navigate("Logout")}
            >
              <View style={styles.sectionRow}>
                <Icon name="logout" size={24} color={colors.error} style={styles.icon} />
                <Text style={[styles.sectionText, { color: colors.error }]}>Logout</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.iconscontainer}>
              <SocialIconsRow />
            </View>
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

const styles = StyleSheet.create({
  maincontainer: {
    width: "100%",
    height: "100%",
    paddingTop: 30,
  },
  container: {
    flex: 1,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  section: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  sectionText: {
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  iconscontainer: {
    marginTop: 20,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  defaultProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
  },
});

export default UserScreen;
