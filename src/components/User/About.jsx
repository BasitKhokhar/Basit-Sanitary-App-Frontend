import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import Loader from '../Loader/Loader';

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
export default function About() {
     const navigation = useNavigation();
  const [aboutData, setAboutData] = useState({
    aboutMsgsData: [],
    aboutImageData: [],
    aboutUsData: [],
    aboutMissionData: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiEndpoints = [
      { key: 'aboutMsgsData', url: `${API_BASE_URL}/about` },
      { key: 'aboutImageData', url: `${API_BASE_URL}/about_image` },
      { key: 'aboutUsData', url: `${API_BASE_URL}/aboutus` },
      { key: 'aboutMissionData', url: `${API_BASE_URL}/about_mission` }
    ];

    Promise.all(
      apiEndpoints.map(endpoint =>
        fetch(endpoint.url)
          .then(response => response.json())
          .then(data => ({ key: endpoint.key, data }))
          .catch(() => ({ key: endpoint.key, data: [] }))
      )
    ).then(results => {
      const updatedData = results.reduce((acc, result) => {
        acc[result.key] = result.data;
        return acc;
      }, {});
      setAboutData(prevData => ({ ...prevData, ...updatedData }));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <View style={styles.loaderContainer}>
      <Loader />
    </View>
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.Text animation="fadeInUp" style={styles.title}>About Us</Animatable.Text>

      {/* About Us Section */}
      <View style={styles.section}>
        <Animatable.View animation="zoomIn" style={styles.imageContainer}>
          {aboutData.aboutImageData.map(item => (
            <Image key={item.id} source={{ uri: item.image_url }} style={styles.image} />
          ))}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.textContainer}>
          {aboutData.aboutUsData.map(items => (
            <Text key={items.id} style={styles.text}>{items.about_us}</Text>
          ))}
        </Animatable.View>
      </View>

      {/* Mission & Vision Section */}
      <Text style={styles.sectionTitle}>Mission & Vision</Text>
      <View style={styles.section}>
        {aboutData.aboutMissionData.map(items => (
          <Animatable.View key={items.id} animation="zoomIn" style={styles.missionContainer}>
            <Text style={styles.missionText}>{items.aboutmission}</Text>
          </Animatable.View>
        ))}
      </View>

      {/* Owners List */}
      {aboutData.aboutMsgsData.map(items => (
        <View key={items.id} style={styles.ownerContainer}>
          <Animatable.Text animation="fadeInUp" style={styles.position}>{items.Position}</Animatable.Text>
          <View style={styles.ownerDetails}>
            <Animatable.Image animation="zoomIn" source={{ uri: items.image_url }} style={styles.ownerImage} />
            <View>
              <Text style={styles.ownerName}>{items.name}</Text>
              <Text style={styles.text}>{items.description}</Text>
              <Text style={styles.contact}><Text style={styles.bold}>Contact:</Text> {items.contact}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20,paddingTop:20,paddingBottom:55, backgroundColor: '#FFF' },
   loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#000', alignSelf:'center'},
  section: { flexDirection: 'column', gap: 10, marginBottom: 20 },
  imageContainer: { alignItems: 'center' },
  image: { width: '100%', height: 350, borderRadius: 10 },
  textContainer: { paddingHorizontal: 10 },
  text: { fontSize: 16, color: '#333',textAlign:'justify' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#000' , alignSelf:'center'},
  missionContainer: { backgroundColor: '#282828', padding: 15, borderRadius: 8 },
  missionText: { color: 'white', fontSize: 16 ,textAlign:'justify'},
  ownerContainer: { marginBottom: 100 },
  position: { backgroundColor: '#AA6231', color: 'white',textAlign:'center',paddingVertical:10, borderRadius: 5, fontSize: 18, fontWeight: 'bold' },
  ownerDetails: { flexDirection: 'column', gap: 10, alignItems: 'center', marginTop: 10 },
  ownerImage: { width: 150, height: 150, borderRadius: 10, borderWidth: 1, borderColor: '#ccc' },
  ownerName: { fontSize: 18, fontWeight: 'bold' },
  contact: { fontSize: 16, marginTop: 5 },
  bold: { fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
