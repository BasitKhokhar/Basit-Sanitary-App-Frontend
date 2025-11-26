// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "../firebase";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const AccountDetailScreen = ({ route }) => {
//   const { userData } = route.params;

//   // Editable fields
//   const [name, setName] = useState(userData.name || "");
//   const [email, setEmail] = useState(userData.email || "");
//   const [phone, setPhone] = useState(userData.phone || "");
//   const [city, setCity] = useState(userData.city || "");

//   const [uploading, setUploading] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   // Pick image from gallery
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       uploadImageToFirebase(result.assets[0].uri);
//     }
//   };

//   const uploadImageToFirebase = async (uri) => {
//     setUploading(true);
//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const userId = await AsyncStorage.getItem("userId");
//       const fileRef = ref(storage, `profileImages/${userId}.jpg`);

//       await uploadBytes(fileRef, blob);
//       const imageUrl = await getDownloadURL(fileRef);
//       saveImageUrlToDatabase(userId, imageUrl);
//     } catch (error) {
//       console.error("Image upload error:", error);
//     }
//     setUploading(false);
//   };

//   const saveImageUrlToDatabase = async (userId, imageUrl) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/upload-profile-image`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: userId, image_url: imageUrl }),
//       });

//       const data = await response.json();
//       console.log("Image upload response:", data);
//     } catch (error) {
//       console.error("Error saving image URL:", error);
//     }
//   };

//   const updateUserDetails = async () => {
//     setUpdating(true);
//     try {
//       const userId = await AsyncStorage.getItem("userId");

//       const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           phone,
//           city
//         }),
//       });

//       const result = await response.json();
//       console.log("Update Response:", result);

//       Alert.alert("Success", "Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating details:", error);
//       Alert.alert("Error", "Failed to update profile.");
//     }
//     setUpdating(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Account Detail</Text>
//       <Text style={styles.subtitle}>You can view and update your details</Text>
//       <View style={styles.data}>
//         <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
//         <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} keyboardType="email-address" />
//         <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" style={styles.input} keyboardType="phone-pad" />
//         <TextInput value={city} onChangeText={setCity} placeholder="City" style={styles.input} />
//         <TouchableOpacity onPress={updateUserDetails} style={styles.updateButton} disabled={updating}>
//           {updating ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.updateText}>Update Details</Text>}
//         </TouchableOpacity>
//         <TouchableOpacity onPress={pickImage} style={styles.uploadButton} disabled={uploading}>
//           {uploading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.uploadText}>Upload Profile Image</Text>}
//         </TouchableOpacity>

       
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: 'center' },
//   subtitle:{fontSize: 16, fontWeight: "400", marginBottom:10, color: "#333", textAlign: 'left'},
//   data: { display: 'flex', flexDirection: 'column', rowGap: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     fontSize: 16,
//     backgroundColor: "#fff"
//   },
//   uploadButton: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginTop: 20
//   },
//   uploadText: { color: "#FFF", fontSize: 16, fontWeight: "bold", textAlign: 'center' },
//   updateButton: {
//     backgroundColor: "#28a745",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   updateText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

// export default AccountDetailScreen;
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { colors } from "../Themes/colors";   // ✅ THEME IMPORT
import { apiFetch } from "../../src/apiFetch";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const AccountDetailScreen = ({ route }) => {
  const { userData } = route.params;

  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [city, setCity] = useState(userData.city || "");

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToFirebase(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = await AsyncStorage.getItem("userId");

      const fileRef = ref(storage, `profileImages/${userId}.jpg`);
      await uploadBytes(fileRef, blob);

      const imageUrl = await getDownloadURL(fileRef);
      saveImageUrlToDatabase(userId, imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    }
    setUploading(false);
  };

  const saveImageUrlToDatabase = async (userId, imageUrl) => {
    try {
      await apiFetch(`/users/upload-profile-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, image_url: imageUrl }),
      });
    } catch (error) {
      console.error("Error saving image URL:", error);
    }
  };

  const updateUserDetails = async () => {
    setUpdating(true);
    try {
      const userId = await AsyncStorage.getItem("userId");

      await apiFetch(`/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city }),
      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
    setUpdating(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Text style={[styles.title, { color: colors.text }]}>Account Detail</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        You can view and update your details
      </Text>

      <View style={styles.data}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={colors.mutedText}
          style={[styles.input, { backgroundColor: colors.white, color: colors.text, borderColor: colors.border }]}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.mutedText}
          style={[styles.input, { backgroundColor: colors.white, color: colors.text, borderColor: colors.border }]}
          keyboardType="email-address"
        />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          placeholderTextColor={colors.mutedText}
          style={[styles.input, { backgroundColor: colors.white, color: colors.text, borderColor: colors.border }]}
          keyboardType="phone-pad"
        />

        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor={colors.mutedText}
          style={[styles.input, { backgroundColor: colors.white, color: colors.text, borderColor: colors.border }]}
        />

        {/* Update Button */}
        <TouchableOpacity
          onPress={updateUserDetails}
          style={styles.updateButton}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={[styles.updateText, { color: colors.accent }]}>
              Update Details
            </Text>
          )}
        </TouchableOpacity>

        {/* Upload Image Button */}
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.uploadButton, { backgroundColor: colors.accent }]}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={[styles.uploadText, { color: colors.white }]}>
              Upload Profile Image
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ------------------ STYLES --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
  },
  data: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },

  updateButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,borderWidth:1.5,borderColor:colors.primary
  },
  updateText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },

  uploadButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  uploadText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AccountDetailScreen;
