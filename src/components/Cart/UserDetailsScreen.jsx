import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNotification } from '../../ContextApis/NotificationsContext';
import { apiFetch } from '../../apiFetch';

import AppText from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import InputField from "../../components/ui/InputField";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { createNotification, fetchNotifications } = useNotification();
  const route = useRoute();
  const {
    user_id,
    subtotal,
    shipping_charges,
    total_amount,
    advance_payment,
    cart_items,
  } = route.params || {};

  const advance = advance_payment ?? Math.round((total_amount || 0) * 0.2);

  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info"); // success | error | info

  const setField = (key) => (text) => setForm((prev) => ({ ...prev, [key]: text }));

  const showModal = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showModal("Permission denied. Please allow gallery access.", "error");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets?.[0]?.uri);
      }
    } catch (error) {
      showModal("Image selection failed.", "error");
    }
  };

  const uploadImageAndSubmit = async () => {
    if (!form.name || !form.phone || !form.city || !form.address || !selectedImage) {
      showModal("Please fill all fields and upload your receipt.", "error");
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
      const requestData = {
        ...form,
        receipt_url: receiptUrl,
        user_id,
        subtotal,
        shipping_charges,
        total_amount,
        cart_items,
      };
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
        `Your order of Rs ${Number(total_amount).toLocaleString()} has been submitted. We will confirm shortly.`,
        "order"
      );

      fetchNotifications();

      showModal("Your order is in progress. You will get a confirmation soon!", "success");

      navigation.navigate("Checkout");
    } catch (error) {
      showModal(`Submission failed: ${error.message}`, "error");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const SummaryRow = ({ label, value, strong, accent }) => (
    <View style={styles.summaryRow}>
      <AppText variant={strong ? "h3" : "body"} color={strong ? "primary" : "secondary"}>{label}</AppText>
      <AppText variant={strong ? "h3" : "bodyLg"} weight={strong ? "800" : "700"} color={accent ? "brand" : "primary"}>
        Rs {Number(value || 0).toLocaleString()}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { paddingBottom: space.xl + insets.bottom + 96 }]}
        >
          <AppText variant="h2" style={{ marginBottom: space.xs }}>Confirm your order</AppText>
          <AppText variant="body" color="secondary" style={{ marginBottom: space.xl }}>
            Add your delivery details and upload your advance payment receipt.
          </AppText>

          {/* Order summary */}
          <Card style={{ marginBottom: space.xl }}>
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Shipping" value={shipping_charges} />
            <View style={styles.divider} />
            <SummaryRow label="Total" value={total_amount} strong accent />
            <View style={styles.advanceBox}>
              <Icon name="info-outline" size={18} color={colors.status.warning} />
              <AppText variant="caption" color="secondary" style={{ flex: 1, marginLeft: space.sm }}>
                Advance to pay now (20%):{" "}
                <AppText variant="caption" weight="800" color="primary">Rs {Number(advance).toLocaleString()}</AppText>.
                Remaining 80% on delivery.
              </AppText>
            </View>
          </Card>

          {/* Delivery details */}
          <AppText variant="label" color="secondary" style={{ marginBottom: space.md }}>
            Delivery details
          </AppText>
          <InputField
            label="Full name"
            icon="person-outline"
            placeholder="e.g. Ahmed Raza"
            value={form.name}
            onChangeText={setField("name")}
          />
          <InputField
            label="Phone number"
            icon="phone"
            placeholder="03XX XXXXXXX"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={setField("phone")}
          />
          <InputField
            label="City"
            icon="location-city"
            placeholder="e.g. Lahore"
            value={form.city}
            onChangeText={setField("city")}
          />
          <InputField
            label="Delivery address"
            icon="home"
            placeholder="House #, street, area"
            multiline
            value={form.address}
            onChangeText={setField("address")}
          />

          {/* Receipt upload */}
          <AppText variant="label" color="secondary" style={{ marginTop: space.sm, marginBottom: space.sm }}>
            Payment receipt
          </AppText>
          <AppText variant="caption" color="muted" style={{ marginBottom: space.md, lineHeight: 18 }}>
            Upload the receipt of the 20% advance paid via JazzCash or EasyPaisa.
          </AppText>

          {selectedImage ? (
            <View style={styles.receiptPreviewWrap}>
              <Image source={{ uri: selectedImage }} style={styles.receiptPreview} />
              <Pressable style={styles.receiptChange} onPress={handleImagePick} hitSlop={8}>
                <Icon name="edit" size={16} color={colors.text.onPrimary} />
                <AppText variant="caption" color="onPrimary" weight="700" style={{ marginLeft: space.xs }}>
                  Change
                </AppText>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.uploadBox} onPress={handleImagePick}>
              <Icon name="cloud-upload" size={28} color={colors.brand.primary} />
              <AppText variant="label" weight="700" color="brand" style={{ marginTop: space.sm }}>
                Select receipt
              </AppText>
              <AppText variant="caption" color="muted" style={{ marginTop: 2 }}>
                JPG or PNG
              </AppText>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky confirm button */}
      <View style={[styles.footer, { paddingBottom: space.lg + insets.bottom }]}>
        <Button
          title={loading || uploading ? "Submitting…" : "Confirm Order"}
          icon="check-circle"
          loading={loading || uploading}
          disabled={loading || uploading}
          onPress={uploadImageAndSubmit}
        />
      </View>

      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalBox}>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeIcon} hitSlop={8}>
              <Icon name="close" size={20} color={colors.text.muted} />
            </Pressable>

            <View
              style={[
                styles.modalIcon,
                { backgroundColor: modalType === "error" ? colors.status.error : colors.brand.primary },
              ]}
            >
              <Icon
                name={modalType === "error" ? "error-outline" : modalType === "success" ? "check" : "info"}
                size={26}
                color={colors.text.onPrimary}
              />
            </View>

            <AppText variant="h3" align="center" style={{ marginTop: space.md }}>
              {modalType === "error" ? "Something went wrong" : modalType === "success" ? "Success" : "Notice"}
            </AppText>
            <AppText variant="body" color="secondary" align="center" style={{ marginTop: space.sm }}>
              {modalMessage}
            </AppText>

            <Button
              title="Got it"
              size="sm"
              style={{ marginTop: space.lg }}
              onPress={() => setModalVisible(false)}
            />
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  scroll: { padding: space.lg },
  divider: { height: 1, backgroundColor: colors.border.subtle, marginVertical: space.sm },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm },
  advanceBox: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: colors.accent.soft, padding: space.md,
    borderRadius: radius.md, marginTop: space.md,
  },
  uploadBox: {
    alignItems: "center", justifyContent: "center",
    paddingVertical: space["2xl"],
    borderRadius: radius.lg, borderWidth: 1.5,
    borderStyle: "dashed", borderColor: colors.brand.primary,
    backgroundColor: colors.brand.tint,
  },
  receiptPreviewWrap: { borderRadius: radius.lg, overflow: "hidden", ...shadows.e2 },
  receiptPreview: { width: "100%", height: 220, backgroundColor: colors.bg.sunken },
  receiptChange: {
    position: "absolute", bottom: space.md, right: space.md,
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.brand.primaryDark,
    paddingHorizontal: space.md, paddingVertical: space.sm,
    borderRadius: radius.pill, ...shadows.e2,
  },
  footer: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: colors.bg.surface,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    paddingHorizontal: space.xl, paddingTop: space.lg,
    ...shadows.e4,
  },
  modalBackdrop: {
    flex: 1, backgroundColor: "rgba(12,26,20,0.55)",
    justifyContent: "center", alignItems: "center", padding: space.xl,
  },
  modalBox: { width: "100%", maxWidth: 360, alignItems: "center", paddingVertical: space.xl },
  closeIcon: { position: "absolute", top: space.md, right: space.md },
  modalIcon: {
    width: 56, height: 56, borderRadius: radius.pill,
    justifyContent: "center", alignItems: "center",
  },
});

export default UserDetailsScreen;
