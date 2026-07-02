import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Modal,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartContext } from "../../ContextApis/cartContext";
import { useWishlist } from "../../ContextApis/WishlistContext";
import { apiFetch } from "../../apiFetch";
import { endpoints } from "../../services/endpoints";

import AppText from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PriceTag from "../../components/ui/PriceTag";
import RatingStars from "../../components/ui/RatingStars";
import HeartButton from "../../components/ui/HeartButton";
import InputField from "../../components/ui/InputField";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { width, height } = Dimensions.get("window");
const colorOptions = ["White", "Half White", "Chrome", "Light Pink", "Light Grey", "Burgundy"];

const ProductModal = ({ product, onClose, userId }) => {
  const { fetchCartCount, bumpCartCount } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const insets = useSafeAreaInsets();

  const [selectedColor, setSelectedColor] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");

  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wishlisted = isWishlisted(product.id);

  // Sale pricing: the on-sale feed sends the discounted amount as `new_price`
  // and keeps the original in `price`; other feeds use original_price/old_price.
  const hasNewPrice = product.new_price != null && Number(product.new_price) > 0;
  const salePrice = hasNewPrice ? Number(product.new_price) : Number(product.price || 0);
  const wasPrice = hasNewPrice
    ? Number(product.price)
    : product.original_price ?? product.old_price ?? null;
  const discountPct =
    wasPrice && Number(wasPrice) > salePrice
      ? Math.round((1 - salePrice / Number(wasPrice)) * 100)
      : null;
  const outOfStock = product.stock != null && Number(product.stock) <= 0;

  const loadReviews = useCallback(async () => {
    try {
      const res = await apiFetch(endpoints.products.reviews(product.id));
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || data.data || []);
      }
    } catch (e) {
      // endpoint may not exist yet — silently show empty state
    }
  }, [product.id]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
      : Number(product.rating || 0);

  const handleAddToCart = () => {
    if (outOfStock || adding) return;

    // Optimistic: reflect the action immediately, then sync with the server.
    setAdding(true);
    bumpCartCount(1);
    setToast("Added to cart");

    apiFetch(endpoints.cart.add, {
      method: "POST",
      body: JSON.stringify({
        ...product,
        selectedColor: selectedColor || "None",
        quantity: 1,
        user_id: userId,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("add failed");
        // Reconcile badge with the authoritative server count.
        fetchCartCount();
      })
      .catch((e) => {
        // Roll back the optimistic bump if the server rejected the add.
        bumpCartCount(-1);
        setToast("Couldn't add — try again");
        if (__DEV__) console.warn("add to cart error", e);
      });

    setTimeout(() => {
      setAdding(false);
      setToast("");
      onClose();
    }, 1100);
  };

  const submitReview = async () => {
    if (!myRating) return;
    setSubmitting(true);

    // Optimistic: show the review instantly at the top of the list.
    const optimistic = {
      id: `local-${Date.now()}`,
      rating: myRating,
      comment: myReview,
      user_name: "You",
      _optimistic: true,
    };
    setReviews((prev) => [optimistic, ...prev]);
    const sentRating = myRating;
    const sentComment = myReview;
    setMyReview("");
    setMyRating(0);

    try {
      const res = await apiFetch(endpoints.products.reviews(product.id), {
        method: "POST",
        body: JSON.stringify({ rating: sentRating, comment: sentComment, user_id: userId }),
      });
      if (res.ok) {
        loadReviews(); // reconcile with the server's canonical list
      } else {
        throw new Error("submit failed");
      }
    } catch (e) {
      // Roll back the optimistic review on failure.
      setReviews((prev) => prev.filter((r) => r.id !== optimistic.id));
      setMyRating(sentRating);
      setMyReview(sentComment);
      if (__DEV__) console.warn("submit review failed", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Hero image */}
          <View style={styles.hero}>
            <Image source={{ uri: product.image_url }} style={styles.heroImage} resizeMode="cover" />
            <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close" hitSlop={8}>
              <Icon name="close" size={22} color={colors.text.primary} />
            </Pressable>
            <View style={styles.heartFloat}>
              <HeartButton active={wishlisted} onToggle={() => toggleWishlist(product)} />
            </View>
            {discountPct ? (
              <View style={styles.discountFloat}>
                <Icon name="local-offer" size={14} color={colors.text.onPrimary} />
                <AppText variant="label" weight="800" color="onPrimary" style={{ marginLeft: 6 }}>
                  {discountPct}% OFF
                </AppText>
              </View>
            ) : product.on_sale || wasPrice ? (
              <View style={styles.saleFloat}>
                <Badge label="SALE" tone="error" />
              </View>
            ) : null}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <AppText variant="h2">{product.name}</AppText>

            <View style={styles.metaRow}>
              <RatingStars rating={avgRating} count={reviews.length} size={16} showValue />
              <Badge
                label={outOfStock ? "Out of stock" : `In stock: ${product.stock ?? "—"}`}
                tone={outOfStock ? "error" : "success"}
                size="sm"
              />
            </View>

            <PriceTag
              price={Math.floor(salePrice)}
              originalPrice={wasPrice ? Math.floor(Number(wasPrice)) : undefined}
              size="h1"
              style={{ marginTop: space.md }}
            />
            {discountPct ? (
              <View style={styles.saveRow}>
                <Icon name="savings" size={16} color={colors.accent.base} />
                <AppText variant="label" weight="700" style={{ color: colors.accent.base, marginLeft: 6 }}>
                  You save {`Rs ${Math.floor(Number(wasPrice) - salePrice).toLocaleString()}`} ({discountPct}%)
                </AppText>
              </View>
            ) : null}

            {product.description ? (
              <AppText variant="body" color="secondary" style={{ marginTop: space.md, lineHeight: 22 }}>
                {product.description}
              </AppText>
            ) : null}

            {/* Color selector */}
            <AppText variant="label" color="secondary" style={{ marginTop: space.xl, marginBottom: space.sm }}>
              Select finish
            </AppText>
            <View style={styles.colorRow}>
              {colorOptions.map((color) => {
                const active = selectedColor === color;
                return (
                  <Pressable
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[styles.colorChip, active && styles.colorChipActive]}
                    accessibilityRole="button"
                  >
                    <AppText variant="caption" weight="600" color={active ? "onPrimary" : "secondary"}>
                      {color}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* Reviews */}
            <View style={styles.divider} />
            <AppText variant="h3" style={{ marginBottom: space.md }}>
              Reviews {reviews.length ? `(${reviews.length})` : ""}
            </AppText>

            {reviews.length ? (
              reviews.slice(0, 5).map((r, i) => (
                <View key={i} style={styles.reviewItem}>
                  <View style={styles.reviewHead}>
                    <AppText variant="label" weight="700">{r.user_name || r.name || "Customer"}</AppText>
                    <RatingStars rating={Number(r.rating || 0)} size={12} />
                  </View>
                  {r.comment ? (
                    <AppText variant="body" color="secondary" style={{ marginTop: 2 }}>{r.comment}</AppText>
                  ) : null}
                </View>
              ))
            ) : (
              <AppText variant="body" color="muted">No reviews yet. Be the first to review.</AppText>
            )}

            {/* Write a review */}
            <View style={styles.writeBox}>
              <AppText variant="label" color="secondary" style={{ marginBottom: space.xs }}>Your rating</AppText>
              <RatingStars rating={myRating} editable onChange={setMyRating} size={26} />
              <InputField
                placeholder="Share your experience…"
                value={myReview}
                onChangeText={setMyReview}
                multiline
                style={{ marginTop: space.md, marginBottom: space.sm }}
              />
              <Button
                title="Submit review"
                variant="secondary"
                size="sm"
                loading={submitting}
                disabled={!myRating}
                onPress={submitReview}
              />
            </View>
          </ScrollView>

          {/* Sticky add to cart */}
          <View style={[styles.footer, { paddingBottom: space.lg + insets.bottom }]}>
            <Button
              title={outOfStock ? "Out of stock" : "Add to Cart"}
              icon="add-shopping-cart"
              loading={adding}
              disabled={outOfStock}
              onPress={handleAddToCart}
            />
          </View>

          {toast ? (
            <View style={styles.toast}>
              <Icon name="check-circle" size={18} color={colors.text.onPrimary} />
              <AppText variant="label" color="onPrimary" weight="700" style={{ marginLeft: space.sm }}>
                {toast}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(12,26,20,0.55)" },
  sheet: {
    height: height * 0.99,
    backgroundColor: colors.bg.canvas,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: "hidden",
  },
  hero: { width: "100%", height: height * 0.34, backgroundColor: colors.bg.sunken },
  heroImage: { width: "100%", height: "100%" },
  closeBtn: {
    position: "absolute", top: space.lg, left: space.lg,
    width: 40, height: 40, borderRadius: radius.pill,
    backgroundColor: colors.bg.surface, justifyContent: "center", alignItems: "center",
    ...shadows.e2,
  },
  heartFloat: { position: "absolute", top: space.lg, right: space.lg },
  saleFloat: { position: "absolute", bottom: space.lg, left: space.lg },
  discountFloat: {
    position: "absolute", bottom: space.lg, left: space.lg,
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.accent.base,
    paddingHorizontal: space.md, paddingVertical: space.sm,
    borderRadius: radius.pill, ...shadows.e2,
  },
  saveRow: { flexDirection: "row", alignItems: "center", marginTop: space.sm },
  body: { padding: space.xl, paddingBottom: space["3xl"] },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: space.sm },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  colorChip: {
    paddingVertical: space.sm, paddingHorizontal: space.lg,
    borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border.default,
    backgroundColor: colors.bg.surface,
  },
  colorChipActive: { backgroundColor: colors.brand.primary, borderColor: colors.brand.primary },
  divider: { height: 1, backgroundColor: colors.border.subtle, marginVertical: space.xl },
  reviewItem: { paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.border.subtle },
  reviewHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  writeBox: {
    marginTop: space.lg, padding: space.lg,
    backgroundColor: colors.bg.surface, borderRadius: radius.lg, ...shadows.e1,
  },
  footer: {
    padding: space.lg,
    backgroundColor: colors.bg.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    ...shadows.e3,
  },
  toast: {
    position: "absolute", bottom: 90, alignSelf: "center",
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.brand.primaryDark,
    paddingHorizontal: space.xl, paddingVertical: space.md,
    borderRadius: radius.pill, ...shadows.e3,
  },
});

export default ProductModal;
