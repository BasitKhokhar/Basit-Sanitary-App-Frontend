// ErrorBoundary — prevents a single component error from crashing the whole app.

import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./ui/Text";
import Button from "./ui/Button";
import { colors } from "../theme/colors";
import { space } from "../theme/spacing";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (__DEV__) console.error("ErrorBoundary caught:", error, info);
    // TODO: wire to crash reporting (Sentry/Firebase Crashlytics) here.
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <AppText variant="h2" align="center">Something went wrong</AppText>
          <AppText variant="body" color="muted" align="center" style={{ marginTop: space.sm, marginBottom: space.xl }}>
            An unexpected error occurred. Please try again.
          </AppText>
          <Button title="Try again" onPress={this.reset} fullWidth={false} style={{ paddingHorizontal: space["3xl"] }} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space["3xl"],
    backgroundColor: colors.bg.canvas,
  },
});

export default ErrorBoundary;
