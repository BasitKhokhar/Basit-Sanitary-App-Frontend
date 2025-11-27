// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
// import { storage } from '../firebase'; // Import storage from firebase.js
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import * as ImagePicker from 'expo-image-picker';
// import { useNavigation } from '@react-navigation/native';
// import { useRoute } from '@react-navigation/native';
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// const UserDetailsScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();  
//   const { user_id, subtotal, shipping_charges, total_amount, cart_items } = route.params || {};

//   console.log('✅ Received Params:', { user_id, subtotal, shipping_charges, total_amount, cart_items });

//   const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', receipt_url: null });
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleImagePick = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'You need to grant permission to access media library.');
//       return;
//     }

//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         // aspect: [4, 3],
//         // quality: 1,
//       });

//       console.log('📷 Image Picker Result:', result);

//       if (!result.canceled) {
//         const uri = result.assets?.[0]?.uri;
//         console.log('🖼 Selected Image URI:', uri);
//         setSelectedImage(uri);
//       } else {
//         console.log('⚠️ User cancelled image selection');
//       }
//     } catch (error) {
//       console.error('❌ Image selection error:', error);
//       Alert.alert('Error', 'Image selection failed');
//     }
//   };

//   const uploadImageAndSubmit = async () => {
//     if (!form.name || !form.phone || !form.city || !form.address || !selectedImage) {
//       Alert.alert('Error', 'Please fill in all fields before submitting.');
//       console.log('⚠️ Missing fields in form:', form);
//       return;
//     }

//     setUploading(true);
//     let receiptUrl = null;

//     try {
//       console.log('🚀 Uploading image...');

//       const response = await fetch(selectedImage);
//       console.log('📤 Fetched image response:', response);

//       const blob = await response.blob();
//       console.log('📂 Converted image to Blob:', blob);

//       const storageRef = ref(storage, `receipts/${Date.now()}`);
//       console.log('🛠 Firebase Storage Reference:', storageRef);

//       await uploadBytes(storageRef, blob);
//       console.log('✅ Image uploaded successfully');

//       receiptUrl = await getDownloadURL(storageRef);
//       console.log('🔗 Firebase Image URL:', receiptUrl);

//     } catch (error) {
//       console.error('❌ Image Upload Error:', error);
//       Alert.alert('Error', 'Image upload failed.');
//       setUploading(false);
//       return;
//     }

//     try {
//       console.log('📦 Preparing order data...');
//       const requestData = { 
//         ...form, 
//         receipt_url: receiptUrl, 
//         user_id, 
//         subtotal, 
//         shipping_charges, 
//         total_amount, 
//         cart_items 
//       };

//       console.log('📜 Order Data:', requestData);
//       setLoading(true);

//       console.log('🌐 Sending request to API...');
//       const responseApi = await fetch(`${API_BASE_URL}/orders`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestData),
//       });

//       console.log('📥 API Response Status:', responseApi.status);
//       console.log('📥 API Response Headers:', responseApi.headers);

//       const responseData = await responseApi.json();
//       console.log('📥 API Response Data:', responseData);

//       if (!responseApi.ok) {
//         throw new Error(`API Error: ${responseData.message || 'Failed to submit order'}`);
//       }

//       Alert.alert('Success', 'Your Order is in Progress. You will soon get Order Confirmation message!');
//       navigation.navigate('Checkout');
//     } catch (error) {
//       console.error('❌ Submission Error:', error);
//       Alert.alert('Error', `Submission failed: ${error.message}`);
//     } finally {
//       setUploading(false);
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Enter Your Details</Text>
//       <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
//       <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={form.phone} onChangeText={(text) => setForm({ ...form, phone: text })} />
//       <TextInput style={styles.input} placeholder="City" value={form.city} onChangeText={(text) => setForm({ ...form, city: text })} />
//       <TextInput style={styles.input} placeholder="Address" multiline value={form.address} onChangeText={(text) => setForm({ ...form, address: text })} />
//       <Text style={styles.text1}>Upload the recipet of 20% advance that you have paid from your JazzCash or easyPiasa App. </Text>
//       <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
//         <Text style={styles.uploadText}>Select Receipt</Text>
//       </TouchableOpacity>

//       {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
//       {uploading && <ActivityIndicator size="large" color="#007bff" />}

//       <TouchableOpacity style={styles.submitButton} onPress={uploadImageAndSubmit} disabled={loading || uploading}>
//         <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Confirm Order'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 10 },
//   text1:{paddingVertical:10},
//   uploadButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
//   uploadText: { color: 'white', fontWeight: 'bold' },
//   imagePreview: { width: '100%', height: 200, borderRadius: 8, marginTop: 10 },
//   submitButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
//   submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
// });

// export default UserDetailsScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../Themes/colors'; // import theme
import { apiFetch } from '../../src/apiFetch';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user_id, subtotal, shipping_charges, total_amount, cart_items } = route.params || {};

  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', receipt_url: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant permission to access media library.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri;
        setSelectedImage(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Image selection failed');
    }
  };

  const uploadImageAndSubmit = async () => {
    if (!form.name || !form.phone || !form.city || !form.address || !selectedImage) {
      Alert.alert('Error', 'Please fill in all fields and upload receipt.');
      return;
    }

    setUploading(true);
    let receiptUrl = null;

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `receipts/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      receiptUrl = await getDownloadURL(storageRef);
    } catch (error) {
      Alert.alert('Error', 'Image upload failed.');
      setUploading(false);
      return;
    }

    try {
      const requestData = { ...form, receipt_url: receiptUrl, user_id, subtotal, shipping_charges, total_amount, cart_items };
      setLoading(true);

      const responseApi = await apiFetch(`/cart/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const responseData = await responseApi.json();

      if (!responseApi.ok) {
        throw new Error(responseData.message || 'Failed to submit order');
      }

      Alert.alert('Success', 'Your Order is in Progress. You will soon get confirmation!');
      navigation.navigate('Checkout');
    } catch (error) {
      Alert.alert('Error', `Submission failed: ${error.message}`);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bodybackground }]} contentContainerStyle={{ paddingBottom: 30 }}>
      

      <View style={[styles.formCard, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { borderColor: colors.secondary, color: colors.text }]}
          placeholder="Full Name"
          placeholderTextColor={colors.mutedText}
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.secondary, color: colors.text }]}
          placeholder="Phone Number"
          placeholderTextColor={colors.mutedText}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.secondary, color: colors.text }]}
          placeholder="City"
          placeholderTextColor={colors.mutedText}
          value={form.city}
          onChangeText={(text) => setForm({ ...form, city: text })}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.secondary, color: colors.text, height: 100 }]}
          placeholder="Address"
          placeholderTextColor={colors.mutedText}
          multiline
          value={form.address}
          onChangeText={(text) => setForm({ ...form, address: text })}
        />

        <Text style={[styles.text1, { color: colors.text }]}>
          Upload the receipt of 20% advance that you have paid from your JazzCash or EasyPaisa App.
        </Text>

        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.cardsbackground, borderWidth: 1.5, borderColor: colors.primary }]}
          onPress={handleImagePick}
        >
          <Text style={[styles.uploadText, { color: colors.primary }]}>Select Receipt</Text>
        </TouchableOpacity>

        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
        {uploading && <ActivityIndicator size="large" color={colors.primary} />}

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={uploadImageAndSubmit}
          disabled={loading || uploading}
        >
          <Text style={[styles.submitText, { color: colors.text }]}>{loading ? 'Submitting...' : 'Confirm Order'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  formCard: { borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  text1: { paddingVertical: 8, fontSize: 14 },
  uploadButton: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  uploadText: { fontWeight: 'bold', fontSize: 16 },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, marginVertical: 10 },
  submitButton: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitText: { fontSize: 16, fontWeight: 'bold' },
});

export default UserDetailsScreen;
