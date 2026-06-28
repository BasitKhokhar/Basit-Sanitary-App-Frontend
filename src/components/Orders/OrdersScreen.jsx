// OrdersScreen — order history list.
// ⚠️ BACKEND TODO: needs GET /orders/myorders returning { orders: [...] }.
// Falls back to an empty state gracefully if the endpoint is absent.

import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { apiFetch } from "../../apiFetch";
import { endpoints } from "../../services/endpoints";
import Card from "../../components/ui/Card";
import AppText from "../../components/ui/Text";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";

const STATUS_TONE = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  delivered: "success",
  completed: "success",
  cancelled: "error",
};

const OrderRow = ({ order, onPress }) => {
  const status = String(order.status || "pending").toLowerCase();
  return (
    <Card onPress={onPress} style={styles.row}>
      <View style={styles.rowTop}>
        <AppText variant="label" weight="700">Order #{order.id ?? order.order_id}</AppText>
        <Badge label={status.toUpperCase()} tone={STATUS_TONE[status] || "neutral"} size="sm" />
      </View>
      <AppText variant="caption" color="muted" style={{ marginTop: space.xs }}>
        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
        {order.item_count ? `  •  ${order.item_count} item(s)` : ""}
      </AppText>
      <View style={styles.rowBottom}>
        <AppText variant="bodyLg" weight="800" color="brand">
          Rs {Number(order.total || order.amount || 0).toLocaleString()}
        </AppText>
        <Icon name="chevron-right" size={20} color={colors.text.muted} />
      </View>
    </Card>
  );
};

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(endpoints.orders.mine(1, 20));
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || data.data || []);
      } else {
        setOrders([]);
      }
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="receipt-long"
          title="No orders yet"
          subtitle="When you place an order it will appear here so you can track it."
          actionLabel="Start shopping"
          onAction={() => navigation.navigate("Main")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item, i) => String(item?.id ?? item?.order_id ?? i)}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.brand.primary} />
        }
        renderItem={({ item }) => (
          <OrderRow order={item} onPress={() => navigation.navigate("OrderDetail", { order: item })} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg.canvas },
  list: { padding: space.lg, paddingBottom: space["4xl"] },
  row: { marginBottom: 0 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: space.md },
});

export default OrdersScreen;
