import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';


function Loader() {
  return (
     <View style={styles.container}>
      <LottieView
        source={require('../../assets/loaderthree.json')} 
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    padding:0,
    // backgroundColor:'black'
  },
});
export default Loader
