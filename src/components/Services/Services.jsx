import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Loader from '../Loader/Loader';
import AppText from '../../components/ui/Text';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import PressableScale from '../../components/ui/PressableScale';
import { apiFetch } from '../../apiFetch';
import { colors } from '../../theme/colors';
import { space } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

const TOP_INSET = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const isFree = (status = '') => {
  const s = status.toLowerCase();
  return s === 'free' || s === 'available';
};

const Services = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [servicesData, setServicesData] = useState([]);
  const [plumbersData, setPlumbersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);

  const fetchData = async () => {
    try {
      const [servicesRes, plumbersRes] = await Promise.all([
        apiFetch('/services/getservices'),
        apiFetch('/services/getplumbers'),
      ]);

      const servicesJson = await servicesRes.json();
      const plumbersJson = await plumbersRes.json();

      setServicesData(servicesJson);
      setPlumbersData(plumbersJson);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch services or plumbers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) setLoginUserId(id);
    } catch (err) {
      console.log('Error fetching userId', err);
    }
  };

  useEffect(() => {
    fetchData();
    getUserId();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  const activeService = servicesData[activeTab];
  const freeCount = plumbersData.filter((p) => isFree(p.status)).length;

  const Hero = (
    <LinearGradient
      colors={[colors.palette.ink, colors.palette.emerald900, colors.palette.emerald800]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.heroRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="micro" color="onPrimary" weight="700" style={styles.overline}>
            BASIT SANITARY
          </AppText>
          <AppText variant="display" color="onPrimary" weight="800" style={{ marginTop: 6 }}>
            Our Services
          </AppText>
          <AppText
            variant="body"
            style={{ color: colors.brand.tint, marginTop: 6, maxWidth: 240 }}
          >
            Trusted sanitary & plumbing experts, ready when you need them.
          </AppText>
        </View>
        <View style={styles.heroBadge}>
          <Icon name="plumbing" size={30} color={colors.text.onPrimary} />
        </View>
      </View>

      <View style={styles.heroStats}>
        <View style={styles.statItem}>
          <AppText variant="h3" color="onPrimary" weight="800">10+</AppText>
          <AppText variant="micro" style={styles.statLabel}>Years exp.</AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <AppText variant="h3" color="onPrimary" weight="800">{plumbersData.length}</AppText>
          <AppText variant="micro" style={styles.statLabel}>Plumbers</AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <AppText variant="h3" color="onPrimary" weight="800">{freeCount}</AppText>
          <AppText variant="micro" style={styles.statLabel}>Available now</AppText>
        </View>
      </View>
    </LinearGradient>
  );

  const CategoryChips = servicesData.length > 0 && (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsRow}
    >
      {servicesData.map((service, index) => {
        const active = activeTab === index;
        return (
          <PressableScale
            key={service.id}
            onPress={() => setActiveTab(index)}
            accessibilityLabel={service.title}
            style={[styles.chip, active && styles.chipActive]}
          >
            <AppText
              variant="label"
              weight="700"
              color={active ? 'onPrimary' : 'secondary'}
            >
              {service.title}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );

  const FeaturedCard = activeService && (
    <View style={styles.featuredCard}>
      <View style={styles.featuredImageWrap}>
        <Image source={{ uri: activeService.image }} style={styles.featuredImage} />
        <LinearGradient
          colors={['transparent', 'rgba(7,53,31,0.85)']}
          locations={[0.4, 1]}
          style={styles.featuredOverlay}
        >
          <Badge label="10+ Years Experience" tone="gold" icon="verified" />
        </LinearGradient>
      </View>
      <View style={styles.featuredBody}>
        <AppText variant="h3" weight="700">
          {activeService.title}
        </AppText>
        <AppText variant="body" color="muted" style={{ marginTop: 6 }}>
          {activeService.description}
        </AppText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={plumbersData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.brand.primary}
            colors={[colors.brand.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            {Hero}
            {CategoryChips}
            {FeaturedCard}

            <View style={styles.sectionHeader}>
              <View>
                <AppText variant="h2" weight="700">Our Plumbers</AppText>
                <AppText variant="caption" color="muted" style={{ marginTop: 2 }}>
                  {freeCount} available right now
                </AppText>
              </View>
              <View style={styles.liveDot}>
                <View style={styles.liveDotInner} />
                <AppText variant="micro" color="success" weight="700">LIVE</AppText>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="engineering"
            title="No plumbers available"
            subtitle="Please check back in a little while."
          />
        }
        renderItem={({ item }) => {
          const free = isFree(item.status);
          return (
            <View style={styles.card}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: item.image_url }} style={styles.avatar} />
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: free ? colors.status.success : colors.status.error },
                  ]}
                />
              </View>

              <View style={styles.cardBody}>
                <AppText variant="h3" weight="700" numberOfLines={1}>
                  {item.name}
                </AppText>

                <View style={styles.contactRow}>
                  <Icon name="phone" size={14} color={colors.text.muted} />
                  <AppText variant="caption" color="muted" style={{ marginLeft: 4 }}>
                    {item.contact}
                  </AppText>
                </View>

                <View style={styles.cardFooter}>
                  <Badge
                    label={free ? 'Available' : item.status}
                    tone={free ? 'success' : 'error'}
                    icon={free ? 'check-circle' : 'schedule'}
                    size="sm"
                  />

                  {free && (
                    <PressableScale
                      accessibilityLabel={`Book ${item.name}`}
                      onPress={() => {
                        if (!loginUserId) {
                          Alert.alert('Error', 'User not logged in');
                          return;
                        }
                        navigation.navigate('bookplumber', {
                          technicianId: item.id,
                          techuserID: item.id,
                          loginUserId,
                        });
                      }}
                      style={shadows.brand}
                    >
                      <LinearGradient
                        colors={colors.gradients.emeraldGlow}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.bookButton}
                      >
                        <Icon name="event-available" size={16} color={colors.text.onPrimary} />
                        <AppText variant="label" color="onPrimary" weight="700" style={{ marginLeft: 6 }}>
                          Book
                        </AppText>
                      </LinearGradient>
                    </PressableScale>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg.canvas },
  listContent: { paddingBottom: 120 },

  // Hero
  hero: {
    paddingTop: TOP_INSET + space.xl,
    paddingHorizontal: space.xl,
    paddingBottom: space['2xl'],
    borderBottomLeftRadius: radius['2xl'],
    borderBottomRightRadius: radius['2xl'],
    ...shadows.e3,
  },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start' },
  overline: { letterSpacing: 2, opacity: 0.85 },
  heroBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space.xl,
    paddingTop: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { color: colors.brand.tint, marginTop: 2 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Category chips
  chipsRow: { paddingHorizontal: space.xl, paddingTop: space.xl, gap: space.sm },
  chip: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  chipActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
    ...shadows.brand,
  },

  // Featured service card
  featuredCard: {
    marginHorizontal: space.xl,
    marginTop: space.xl,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.e2,
  },
  featuredImageWrap: { width: '100%', height: 180 },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: space.lg,
  },
  featuredBody: { padding: space.lg },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.xl,
    marginTop: space['2xl'],
    marginBottom: space.md,
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg.tint,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
  },
  liveDotInner: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.status.success },

  // Plumber card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    padding: space.md,
    marginHorizontal: space.xl,
    marginBottom: space.md,
    ...shadows.e1,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 76, height: 76, borderRadius: radius.lg, backgroundColor: colors.bg.sunken },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 2.5,
    borderColor: colors.bg.surface,
  },
  cardBody: { flex: 1, marginLeft: space.lg },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.md,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
});

export default Services;
