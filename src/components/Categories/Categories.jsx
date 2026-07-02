// Categories — premium horizontal rail of circular category tiles.
// Round image avatars (no ring) with a soft shadow, name below.
// Gives a cleaner, more premium "shop by category" feel.

import React, { useState, useCallback } from "react";
import { View, FlatList, Image, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import PressableScale from "../ui/PressableScale";
import AppText from "../ui/Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { shadows } from "../../theme/shadows";

const CIRCLE = 84;

const CategoryTile = ({ item, onPress }) => {
  const [failed, setFailed] = useState(false);

  return (
    <PressableScale style={styles.tile} onPress={onPress} accessibilityLabel={item.name}>
      <View style={styles.avatarWrap}>
        {!failed && item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <View style={[styles.image, styles.fallback]}>
            <Icon name="category" size={28} color={colors.brand.primary} />
          </View>
        )}
      </View>

      <AppText
        variant="label"
        weight="600"
        numberOfLines={2}
        style={styles.label}
      >
        {item.name}
      </AppText>
    </PressableScale>
  );
};

const Categories = ({ categoriesData }) => {
  const navigation = useNavigation();

  const renderItem = useCallback(
    ({ item }) => (
      <CategoryTile
        item={item}
        onPress={() => navigation.navigate("Subcategories", { categoryId: item.id })}
      />
    ),
    [navigation]
  );

  if (!categoriesData || categoriesData.length === 0) {
    return (
      <View style={styles.empty}>
        <AppText variant="body" color="muted">No categories found.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <AppText variant="h3">Shop by Category</AppText>
        <AppText variant="caption" color="muted" style={{ marginTop: 2 }}>
          Explore our premium collections
        </AppText>
      </View>

      <FlatList
        data={categoriesData}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: space.lg }} />}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginVertical:10 },
  header: { paddingHorizontal: space.lg, marginBottom: space.md },
  listContent: { paddingHorizontal: space.lg, paddingVertical: space.sm },
  tile: {
    width: CIRCLE + 12,
    alignItems: "center",
  },
  avatarWrap: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    overflow: "hidden",
    backgroundColor: colors.bg.surface,
    ...shadows.e3,
  },
  image: { width: "100%", height: "100%" },
  fallback: { justifyContent: "center", alignItems: "center", backgroundColor: colors.brand.tint },
  label: {
    marginTop: space.sm,
    textAlign: "center",
    color: colors.text.primary,
  },
  empty: { height: 180, justifyContent: "center", alignItems: "center" },
});

export default React.memo(Categories);
