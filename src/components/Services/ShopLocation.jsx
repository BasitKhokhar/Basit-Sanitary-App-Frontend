import React, { useState } from 'react';
import { View, Image, StyleSheet, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import PressableScale from '../../components/ui/PressableScale';
import AppText from '../../components/ui/Text';
import { colors } from '../../theme/colors';
import { space } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

// react-native-maps needs a native Google Maps API key. If it isn't configured
// we must NOT mount <MapView>, because the native view throws
// "IllegalStateException: API key not found" and crashes the whole screen.
// Detect the key from the Expo config; without it we render a real map using a
// keyless OpenStreetMap static tile image instead of an empty placeholder.
const GOOGLE_MAPS_API_KEY =
  Constants.expoConfig?.android?.config?.googleMaps?.apiKey ||
  Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY ||
  '';

const SHOP = {
  latitude: 32.063720,
  longitude: 72.693895,
  label: 'Basit Sanitary Store',
  address: 'Sargodha Road, Bhalwal, Punjab',
};

const ShopLocation = () => {
  const [imgFailed, setImgFailed] = useState(false);
  const latLng = `${SHOP.latitude},${SHOP.longitude}`;

  const openInMaps = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${SHOP.label}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${SHOP.label})`,
    });
    Linking.openURL(url).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latLng}`)
    );
  };

  // Keyless OpenStreetMap static map — a real map tile with a marker pin.
  const staticMapUrl =
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${latLng}&zoom=16&size=640x360&maptype=mapnik` +
    `&markers=${latLng},red-pushpin`;

  const InfoOverlay = (
    <LinearGradient
      colors={['transparent', 'rgba(7,53,31,0.55)', 'rgba(7,53,31,0.95)']}
      locations={[0.3, 0.65, 1]}
      style={styles.overlay}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Icon name="place" size={16} color={colors.brand.primaryLight} />
          <AppText variant="bodyLg" color="onPrimary" weight="700" style={{ marginLeft: 4 }} numberOfLines={1}>
            {SHOP.label}
          </AppText>
        </View>
        <AppText
          variant="caption"
          style={{ color: 'rgba(255,255,255,0.8)', marginTop: 2 }}
          numberOfLines={1}
        >
          {SHOP.address}
        </AppText>
      </View>
      <PressableScale style={styles.directionsBtn} onPress={openInMaps} accessibilityLabel="Get directions">
        <Icon name="directions" size={16} color={colors.text.onPrimary} />
        <AppText variant="label" color="onPrimary" weight="700" style={{ marginLeft: 4 }}>
          Directions
        </AppText>
      </PressableScale>
    </LinearGradient>
  );

  // Decide what fills the map area: native map (key present) > static tile >
  // simple icon fallback (offline / tile service unreachable).
  let mapBody;
  if (GOOGLE_MAPS_API_KEY) {
    const MapView = require('react-native-maps').default;
    const { Marker } = require('react-native-maps');
    mapBody = (
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...SHOP, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        <Marker coordinate={{ latitude: SHOP.latitude, longitude: SHOP.longitude }} title={SHOP.label} />
      </MapView>
    );
  } else if (!imgFailed) {
    mapBody = (
      <Image
        source={{ uri: staticMapUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onError={() => setImgFailed(true)}
      />
    );
  } else {
    mapBody = (
      <View style={[StyleSheet.absoluteFill, styles.fallback]}>
        <Icon name="place" size={44} color={colors.brand.primary} />
        <AppText variant="label" color="muted" style={{ marginTop: 6 }}>Tap for directions</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Visit Our Store</AppText>
          <AppText variant="caption" color="muted" style={{ marginTop: 2 }}>
            Find us on the map
          </AppText>
        </View>
      </View>

      <PressableScale style={styles.mapCard} onPress={openInMaps} accessibilityLabel="Open shop location in Maps">
        {mapBody}
        {InfoOverlay}
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.lg,
    marginBottom: space['2xl'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
  },
  mapCard: {
    height: 200,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg.sunken,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.e2,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: space.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    ...shadows.brand,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.tint,
  },
});

export default ShopLocation;
