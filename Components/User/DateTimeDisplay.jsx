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
    width:'100%',
    flex: 1,
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    gap:15
    // backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color:'#E0E0E0'
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
     color:'#E0E0E0'
  },
});

export default DateTimeDisplay;
