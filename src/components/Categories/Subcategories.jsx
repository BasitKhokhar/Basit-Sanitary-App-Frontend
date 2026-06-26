
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { colors } from '../Themes/colors';
import { apiFetch } from '../../src/apiFetch';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const screenWidth = Dimensions.get('window').width;

const Subcategories = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params;

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchSubcategories = async () => {
      try {
        const response = await apiFetch(`/products/categories/${categoryId}/subcategories`);
        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bodybackground }}>
        <ActivityIndicator size="large" color={colors.primary} /> 
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: colors.bodybackground }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center',
          color: colors.text,       // theme text
        }}
      >
        Subcategories
      </Text>

      <FlatList
        key={'fixed-columns'}
        data={subcategories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              width: screenWidth / 3 - 15,
              margin: 5,
              alignItems: 'center',
              backgroundColor: colors.cardsbackground,   // theme card background
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,                // theme border
            }}
            onPress={() => navigation.navigate('Products', { subcategoryId: item.id })}
          >
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: '100%',
                height: 80,
                borderRadius: 6,
                backgroundColor: colors.secondary,       // fallback background
                marginBottom: 5,
              }}
              resizeMode="cover"
            />

            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                color: colors.text,                      // theme text
                fontWeight: '500',
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Subcategories;
