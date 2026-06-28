import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

import AppText from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import PressableScale from '../../components/ui/PressableScale';
import { colors } from '../../theme/colors';
import { space } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const TOP_INSET = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const ServiceBookingForm = ({ route, navigation }) => {
  const { technicianId, techuserID, loginUserId } = route.params;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasLocation = !!latitude && !!longitude;

  const getLocation = async () => {
    setLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toString());
      setLongitude(loc.coords.longitude.toString());
    } catch (error) {
      Alert.alert('Error', 'Could not retrieve location.');
    } finally {
      setLocating(false);
    }
  };

  const validateInputs = () => {
    if (!name || !email || !phone || !city || !description || !latitude || !longitude) {
      Alert.alert('Validation Error', 'All fields are required, including location.');
      return false;
    }
    return true;
  };

  const submitBooking = async () => {
    if (!validateInputs()) return;
    setSubmitting(true);
    const bookingData = { techuserID, loginUserId, name, email, phone, city, description, latitude, longitude };
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your request has been submitted successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Failed', 'Booking failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error submitting booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Gradient hero */}
        <LinearGradient
          colors={colors.gradients.emeraldDeep}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <PressableScale
              onPress={() => navigation.goBack()}
              accessibilityLabel="Go back"
              style={styles.backBtn}
            >
              <Icon name="arrow-back" size={22} color={colors.text.onPrimary} />
            </PressableScale>
            <View style={styles.heroBadge}>
              <Icon name="plumbing" size={26} color={colors.text.onPrimary} />
            </View>
          </View>

          <AppText variant="h1" color="onPrimary" weight="800" style={{ marginTop: space.lg }}>
            Book a Plumber
          </AppText>
          <AppText variant="body" style={{ color: colors.brand.tint, marginTop: 6, maxWidth: 280 }}>
            Share your details and location — we'll dispatch your technician shortly.
          </AppText>
        </LinearGradient>

        {/* Form card */}
        <View style={styles.card}>
          <View style={styles.sectionRow}>
            <Icon name="person" size={18} color={colors.brand.primary} />
            <AppText variant="label" color="secondary" weight="700" style={{ marginLeft: 6 }}>
              YOUR DETAILS
            </AppText>
          </View>

          <InputField
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            icon="badge"
          />
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="email"
          />
          <InputField
            label="Phone"
            placeholder="03xx-xxxxxxx"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon="phone"
          />
          <InputField
            label="City"
            placeholder="Your city"
            value={city}
            onChangeText={setCity}
            icon="location-city"
          />
          <InputField
            label="Problem Description"
            placeholder="Briefly describe the issue..."
            value={description}
            onChangeText={setDescription}
            multiline
            icon="description"
          />

          <View style={[styles.sectionRow, { marginTop: space.sm }]}>
            <Icon name="my-location" size={18} color={colors.brand.primary} />
            <AppText variant="label" color="secondary" weight="700" style={{ marginLeft: 6 }}>
              LOCATION
            </AppText>
          </View>

          {/* Location capture card */}
          <View style={[styles.locationCard, hasLocation && styles.locationCardActive]}>
            <View style={styles.locationIconWrap}>
              <Icon
                name={hasLocation ? 'check-circle' : 'place'}
                size={24}
                color={hasLocation ? colors.status.success : colors.brand.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: space.md }}>
              <AppText variant="bodyLg" weight="700">
                {hasLocation ? 'Location captured' : 'Pin your location'}
              </AppText>
              <AppText variant="caption" color="muted" numberOfLines={1} style={{ marginTop: 2 }}>
                {hasLocation
                  ? `${Number(latitude).toFixed(5)}, ${Number(longitude).toFixed(5)}`
                  : 'Tap below to auto-fill coordinates'}
              </AppText>
            </View>
          </View>

          <Button
            title={hasLocation ? 'Update Location' : 'Take Current Location'}
            variant="secondary"
            icon="gps-fixed"
            loading={locating}
            onPress={getLocation}
            style={{ marginTop: space.lg }}
          />

          <Button
            title="Submit Booking"
            icon="check"
            loading={submitting}
            onPress={submitBooking}
            style={{ marginTop: space.md }}
          />

          <AppText variant="caption" color="muted" align="center" style={{ marginTop: space.md }}>
            By submitting, you agree to be contacted about this booking.
          </AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  scrollContent: { paddingBottom: 40 },

  hero: {
    paddingTop: TOP_INSET + space.lg,
    paddingHorizontal: space.xl,
    paddingBottom: space['3xl'],
    borderBottomLeftRadius: radius['2xl'],
    borderBottomRightRadius: radius['2xl'],
    ...shadows.e3,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    marginTop: -space.xl,
    marginHorizontal: space.lg,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    padding: space.xl,
    ...shadows.e2,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: space.lg },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.sunken,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  locationCardActive: {
    backgroundColor: colors.bg.tint,
    borderColor: colors.brand.primaryLight,
  },
  locationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.bg.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceBookingForm;
