import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';

import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNotification } from '../../src/ContextApis/NotificationsContext';
import { colors } from '../Themes/colors';
import { apiFetch } from '../../src/apiFetch';
import Constants from 'expo-constants';
import Icon from "react-native-vector-icons/MaterialIcons";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const { createNotification, fetchNotifications } = useNotification();
  const route = useRoute();
  const { user_id, subtotal, shipping_charges, total_amount, cart_items } = route.params || {};

  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', receipt_url: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // success | error | info

  const showModal = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showModal("Permission Denied. Please allow gallery access.", "error");
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
      showModal("Image selection failed.", "error");
    }
  };

  const uploadImageAndSubmit = async () => {
    if (!form.name || !form.phone || !form.city || !form.address || !selectedImage) {
      showModal("Please fill all fields and upload receipt.", "error");
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
      setUploading(false);
      showModal("Image upload failed.", "error");
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
      if (!responseApi.ok) throw new Error(responseData.message || "Failed to submit order");

      await createNotification(
        "Order Placed Successfully",
        `Your order of Rs ${total_amount} has been submitted. We will confirm shortly.`,
        "order"
      );

      fetchNotifications();

      showModal("Your Order is in Progress. You will soon get confirmation!", "success");

      navigation.navigate("Checkout");

    } catch (error) {
      showModal(`Submission failed: ${error.message}`, "error");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bodybackground }]}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View
          style={[styles.formCard, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}
        >
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
            style={[styles.input, { borderColor: colors.secondary, color: colors.text, height: 100, textAlignVertical: "top" }]}
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
            <Text style={[styles.submitText, { color: colors.text }]}>
              {loading ? "Submitting..." : "Confirm Order"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: colors.cardsbackground }]}>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeIconWrapper}>
              <Icon name="close" size={22} color={colors.primary} />
            </Pressable>

            <Text style={[styles.modalTitle, { color: modalType === "error" ? "red" : colors.primary }]}>
              {modalType === "error" ? "Error" : "Message"}
            </Text>

            <Text style={[styles.modalMessage, { color: colors.text }]}>{modalMessage}</Text>

            <TouchableOpacity
              style={[styles.okBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.okText, { color: colors.text }]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  formCard: { borderRadius: 12, padding: 16, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  text1: { paddingVertical: 8, fontSize: 14 },
  uploadButton: { padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  uploadText: { fontWeight: "bold", fontSize: 16 },
  imagePreview: { width: "100%", height: 200, borderRadius: 8, marginVertical: 10 },
  submitButton: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  submitText: { fontSize: 16, fontWeight: "bold" },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "85%", padding: 20, borderRadius: 12, position: "relative" },
  closeIconWrapper: { position: "absolute", top: 10, right: 10, backgroundColor: colors.bodybackground, width: 32, height: 32, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  modalMessage: { fontSize: 15, textAlign: "center", marginVertical: 10, paddingHorizontal: 5 },
  okBtn: { marginTop: 15, padding: 10, borderRadius: 8, alignSelf: "center", width: "40%", alignItems: "center" },
  okText: { fontSize: 16, fontWeight: "bold" },
});

export default UserDetailsScreen;
