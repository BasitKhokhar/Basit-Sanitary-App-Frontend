// OrderDetailScreen — order summary + simple status tracker.
// Receives the order via route params (from OrdersScreen). Optionally refetches
// full detail from GET /orders/:id when available. ⚠️ BACKEND TODO for live status.

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import Card from "../../src/components/ui/Card";
import AppText from "../../src/components/ui/Text";
import Badge from "../../src/components/ui/Badge";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import { radius } from "../../src/theme/radius";

const STEPS = ["pending", "processing", "shipped", "delivered"];
const LABELS = { pending: "Placed", processing: "Processing", shipped: "Shipped", delivered: "Delivered" };

const Tracker = ({ status }) => {
  const current = Math.max(STEPS.indexOf(String(status || "pending").toLowerCase()), 0);
  return (
    <View style={styles.tracker}>
      {STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <View key={step} style={styles.step}>
            <View style={styles.stepCol}>
              <View style={[styles.dot, done && styles.dotActive]}>
                <Icon name={done ? "check" : "radio-button-unchecked"} size={14} color={done ? colors.text.onPrimary : colors.text.muted} />
              </View>
              {i < STEPS.length - 1 ? <View style={[styles.line, i < current && styles.lineActive]} /> : null}
            </View>
            <AppText variant="caption" color={done ? "primary" : "muted"} weight={done ? "700" : "400"} style={{ marginTop: space.xs }}>
              {LABELS[step]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

const OrderDetailScreen = ({ route }) => {
  const order = route?.params?.order || {};
  const items = order.items || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={{ marginBottom: space.lg }}>
        <View style={styles.headerRow}>
          <AppText variant="h3">Order #{order.id ?? order.order_id ?? "—"}</AppText>
          <Badge label={String(order.status || "pending").toUpperCase()} tone="info" size="sm" />
        </View>
        {order.created_at ? (
          <AppText variant="caption" color="muted" style={{ marginTop: space.xs }}>
            Placed on {new Date(order.created_at).toLocaleString()}
          </AppText>
        ) : null}
      </Card>

      <Card style={{ marginBottom: space.lg }}>
        <AppText variant="label" color="secondary" style={{ marginBottom: space.lg }}>Tracking</AppText>
        <Tracker status={order.status} />
      </Card>

      {items.length ? (
        <Card style={{ marginBottom: space.lg }}>
          <AppText variant="label" color="secondary" style={{ marginBottom: space.md }}>Items</AppText>
          {items.map((it, i) => (
            <View key={i} style={styles.itemRow}>
              <AppText variant="body" numberOfLines={1} style={{ flex: 1 }}>
                {it.name} × {it.quantity || 1}
              </AppText>
              <AppText variant="body" weight="700">Rs {Number(it.price || 0).toLocaleString()}</AppText>
            </View>
          ))}
        </Card>
      ) : null}

      <Card>
        <View style={styles.totalRow}>
          <AppText variant="bodyLg" weight="700">Total</AppText>
          <AppText variant="h3" color="brand" weight="800">
            Rs {Number(order.total || order.amount || 0).toLocaleString()}
          </AppText>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  content: { padding: space.lg, paddingBottom: space["4xl"] },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tracker: { flexDirection: "row", justifyContent: "space-between" },
  step: { flex: 1, alignItems: "center" },
  stepCol: { flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" },
  dot: {
    width: 28, height: 28, borderRadius: radius.pill,
    backgroundColor: colors.bg.sunken, justifyContent: "center", alignItems: "center",
  },
  dotActive: { backgroundColor: colors.brand.primary },
  line: { position: "absolute", right: -50, width: 60, height: 2, backgroundColor: colors.border.default },
  lineActive: { backgroundColor: colors.brand.primary },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: space.sm, borderBottomWidth: 1, borderBottomColor: colors.border.subtle },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});

export default OrderDetailScreen;
