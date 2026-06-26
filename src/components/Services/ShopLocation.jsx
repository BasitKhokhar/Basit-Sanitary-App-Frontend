import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const ShopLocation = () => {
  const shopLatitude = 32.063720;
  const shopLongitude = 72.693895;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Our Shop Location</Text> */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: shopLatitude,
            longitude: shopLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: shopLatitude, longitude: shopLongitude }}
            title="Basit Sanitary"
            description="Visit us here!"
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#1A1A1A',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 15,
  },
  mapContainer: {
    width: '90%',
    height: 300,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
});

export default ShopLocation;
