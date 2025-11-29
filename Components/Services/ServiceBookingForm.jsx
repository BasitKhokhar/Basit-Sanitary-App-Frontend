import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { colors } from '../Themes/colors';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const ServiceBookingForm = ({ route, navigation }) => {
  const { technicianId, techuserID, loginUserId } = route.params;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toString());
      setLongitude(loc.coords.longitude.toString());
    } catch (error) {
      Alert.alert('Error', 'Could not retrieve location.');
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
    const bookingData = { techuserID, loginUserId, name, email, phone, city, description, latitude, longitude };
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        Alert.alert('Success', 'Your request has been submitted successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Failed', 'Booking failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error submitting booking.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bodybackground }]}>

      <View style={styles.formContainer}>
        {/* <Text style={styles.heading}>Book a Electrician</Text> */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.mutedText}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor={colors.mutedText}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={colors.mutedText}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
          placeholderTextColor={colors.mutedText}
        />
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top'}]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor={colors.mutedText}
        />

        <Text style={styles.note}>
          Latitude and Longitude will automatically be filled when you click 'Take Current Location'
        </Text>
        <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
          <Text style={[styles.buttonText, { color: colors.primary }]}>Take Location</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
          <TextInput
            style={[styles.input,{flex:1}]}
            placeholder="Latitude"
            value={latitude}
            editable={false}
            placeholderTextColor={colors.mutedText}
          />
          <TextInput
             style={[styles.input,{flex:1}]}
            placeholder="Longitude"
            value={longitude}
            editable={false}
            placeholderTextColor={colors.mutedText}
          />

        </View>



        <TouchableOpacity style={styles.submitButton} onPress={submitBooking}>
          <Text style={styles.buttonText}>Submit Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginVertical: 10,
  },
  formContainer: {
    marginTop: 20,
    backgroundColor: colors.cardsbackground,
    marginHorizontal: 15,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.bodybackground,
    color: colors.text,
    fontSize: 16,
  },
  note: {
    fontSize: 13,
    color: colors.mutedText,
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: colors.cardsbackground, borderWidth: 1.5, borderColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: colors.accent,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: colors.bodybackground,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ServiceBookingForm;
