// InputField — clean focus states with animated emerald focus ring + label.

import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import AppText from "./Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { typography } from "../../theme/typography";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  icon,
  error,
  multiline,
  style,
  // Autofill suppression defaults — without these, Android (New Architecture)
  // bounces focus across every field when one is tapped (all borders flash).
  // Callers can still override per-field by passing these props explicitly.
  autoComplete = "off",
  importantForAutofill = "no",
  textContentType = "none",
  autoCorrect = false,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const borderColor = error
    ? colors.status.error
    : focused
    ? colors.brand.primary
    : colors.border.default;

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <AppText variant="label" color="secondary" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View
        // Exclude the whole input subtree from Android autofill, not just the
        // leaf TextInput. On New-Arch (Fabric), leaf-only "no" still lets the
        // autofill framework cross-wire siblings (tapping one field focuses
        // another + opens the wrong keyboard); excluding descendants stops it.
        importantForAutofill="noExcludeDescendants"
        style={[
          styles.field,
          { borderColor, backgroundColor: colors.bg.surface },
          focused && styles.focusedShadow,
          multiline && { height: undefined, minHeight: 96, alignItems: "flex-start", paddingTop: space.md },
        ]}
      >
        {icon ? (
          <Icon name={icon} size={20} color={focused ? colors.brand.primary : colors.text.muted} style={{ marginRight: space.sm }} />
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          autoComplete={autoComplete}
          importantForAutofill={importantForAutofill}
          textContentType={textContentType}
          autoCorrect={autoCorrect}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, { color: colors.text.primary }]}
          {...rest}
        />
        {secureTextEntry ? (
          <Icon
            name={hidden ? "visibility-off" : "visibility"}
            size={20}
            color={colors.text.muted}
            onPress={() => setHidden((h) => !h)}
          />
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color="error" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

const MemoInputField = React.memo(InputField);

const styles = StyleSheet.create({
  wrap: { marginBottom: space.lg },
  label: { marginBottom: space.xs },
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
  },
  focusedShadow: {
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  input: { flex: 1, ...typography.bodyLg, paddingVertical: 0 },
  error: { marginTop: space.xs },
});

export default MemoInputField;
