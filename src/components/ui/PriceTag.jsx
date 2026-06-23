// PriceTag — clear pricing hierarchy: bold current + struck original + discount.

import React from "react";
import { View } from "react-native";
import AppText from "./Text";
import Badge from "./Badge";
import { space } from "../../theme/spacing";

const fmt = (n, currency = "Rs") =>
  `${currency} ${Number(n || 0).toLocaleString()}`;

const PriceTag = ({
  price,
  originalPrice,
  currency = "Rs",
  size = "h3",
  showDiscount = true,
  style,
}) => {
  const hasDiscount = originalPrice && Number(originalPrice) > Number(price);
  const pct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <View style={[{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }, style]}>
      <AppText variant={size} color="primary" weight="800">
        {fmt(price, currency)}
      </AppText>
      {hasDiscount ? (
        <>
          <AppText
            variant="caption"
            color="muted"
            style={{ marginLeft: space.sm, textDecorationLine: "line-through" }}
          >
            {fmt(originalPrice, currency)}
          </AppText>
          {showDiscount ? (
            <Badge label={`-${pct}%`} tone="error" size="sm" style={{ marginLeft: space.sm }} />
          ) : null}
        </>
      ) : null}
    </View>
  );
};

export default React.memo(PriceTag);
