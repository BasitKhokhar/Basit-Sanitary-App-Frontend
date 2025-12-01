// import React, { useState, useEffect } from "react";
// import { View, Text, Image, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import DateTimeDisplay from "./DateTimeDisplay";
// import Constants from 'expo-constants';
// import { apiFetch } from "../../src/apiFetch";
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const UserNameDisplay = () => {
//   const [userName, setUserName] = useState("");
//   const [userImage, setUserImage] = useState(null);

//  useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       // Get user details (name, phone, email)
//       const response = await apiFetch(`/users/getuserdetails`);
//       if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
//       const data = await response.json();
//       setUserName(data.name);

//       // Get user image
//       const imageResponse = await apiFetch(`/users/user_images`);
//       if (imageResponse.ok) {
//         const imageData = await imageResponse.json();
//         setUserImage(imageData.image_url);
//       }

//     } catch (error) {
//       console.error("❌ Error fetching user:", error);
//     }
//   };

//   fetchUserData();
// }, []);


//   return (
//     <LinearGradient
//       colors={["#1A1A1A","#1A1A1A", "#1A1A1A", ]
//       } 
//       start={{ x: 0, y: 1 }}
//       end={{ x: 0, y: .4 }}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//         <Text style={styles.text}>{userName ? `Welcome, ${userName}!` : "Loading..."}</Text>
//         <View style={styles.imageContainer}>
//           {userImage ? (
//             <Image source={{ uri: userImage }} style={styles.profileImage} />
//           ) : (
//             <View style={styles.defaultProfileCircle} />
//           )}
//         </View>
//       </View>

//       <Text style={styles.text1}>Explore a wide range of sanitary products and expert plumbing services.</Text>

//       <View>
//         <DateTimeDisplay />
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "flex-start",
//     height:250,
//     width: "100%",
//     paddingTop: 20,
//     paddingBottom: 70,
//     borderBottomRightRadius: 70,
//   },
//   text: { fontSize: 24, fontWeight: "bold", color: "white" },
//   text1: { fontSize: 18, color: "#E0E0E0", marginLeft: 25, marginRight: 27, marginTop: 10,paddingTop:10, borderTopWidth:1,
//     borderBottomColor:'white' },
//   header: {
//     display: "flex",
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 25,
//     paddingBottom:10
//   },
//   // Profile Image Styles
//   imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
//   profileImage: { width: "100%", height: "100%", borderRadius: 50, borderWidth: 2, borderColor: "white" },
//   defaultProfileCircle: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, borderColor: "white", backgroundColor: "#fff" },
// });

// export default UserNameDisplay;
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimeDisplay from "./DateTimeDisplay";
import Constants from 'expo-constants';
import { apiFetch } from "../../src/apiFetch";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const { height: screenHeight } = Dimensions.get("window"); // Get device height

const UserNameDisplay = () => {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiFetch(`/users/getuserdetails`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setUserName(data.name);

        const imageResponse = await apiFetch(`/users/user_images`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setUserImage(imageData.image_url);
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <LinearGradient
      colors={["#1A1A1A", "#1A1A1A", "#1A1A1A"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0.4 }}
      style={[styles.container, { height: screenHeight * 0.33 }]} // ~37% of screen height
    >
      <View style={styles.header}>
        <Text style={styles.text}>
          {userName ? `Welcome, ${userName}!` : "Loading..."}
        </Text>
        <View style={styles.imageContainer}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultProfileCircle} />
          )}
        </View>
      </View>

      <Text style={styles.text1}>
        Explore a wide range of sanitary products and expert plumbing services.
      </Text>

      <View style={styles.dateTimeWrapper}>
        <View style={styles.dateTimeInner}>
          <DateTimeDisplay />
        </View>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 0,
    paddingBottom: 15,
    borderBottomRightRadius: 70,
    justifyContent: "space-between", 
  },
  text: { fontSize: 24, fontWeight: "bold", color: "white" },
  text1: {
    fontSize: 18,
    color: "#E0E0E0",
    marginHorizontal: 25,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "white",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
  profileImage: { width: "100%", height: "100%", borderRadius: 50, borderWidth: 2, borderColor: "white" },
  defaultProfileCircle: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, borderColor: "white", backgroundColor: "#fff" },
  dateTimeWrapper: {

    alignSelf: "center",
    marginBottom: 15, // padding from bottom
  },
});

export default UserNameDisplay;
