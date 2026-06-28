import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{currentDateTime.toDateString()}</Text>
      <Text style={styles.timeText}>{currentDateTime.toLocaleTimeString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    alignItems: "center",
    gap:8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color:'#D7E4DD'
  },
  timeText: {
    fontSize: 12,
    fontWeight: "700",
     color:'#FFFFFF'
  },
});

export default DateTimeDisplay;
