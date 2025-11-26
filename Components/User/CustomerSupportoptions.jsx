// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// // Icon mapping array
// const icons = ["car", "life-ring", "rotate-right", "lock"];

// // Gradient colors for each card
// const gradients = [
//   ['#FF5733', '#FF8D33'], 
//   ['#FC466B', '#3F5EFB'], 
//   ['#3357FF', '#338DFF'], 
//   ['#FF33A8', '#FF3380'],
// ];

// const CustomerSupportOptions = () => {
//   const [firstColumnData, setFirstColumnData] = useState([]);
//   const [secondColumnData, setSecondColumnData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response1 = await fetch(`${API_BASE_URL}/first_column_data`);
//       const data1 = await response1.json();

//       const response2 = await fetch(`${API_BASE_URL}/second_column_data`);
//       const data2 = await response2.json();

//       setFirstColumnData(Array.isArray(data1) ? data1 : []);
//       setSecondColumnData(Array.isArray(data2) ? data2 : []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#282828" style={styles.loader} />;
//   }

//   const getSafeGradient = (index) =>
//     gradients[index % gradients.length] || ['#000', '#111'];

//   const getSafeIcon = (index) =>
//     icons[index % icons.length] || 'info-circle';

//   return (
//     <View style={styles.container}>
//       {/* First Column */}
//       <View style={styles.column}>
//         {firstColumnData.map((item, index) => (
//           <LinearGradient
//             colors={getSafeGradient(index)}
//             style={[styles.card, index === 0 ? styles.tallCard : styles.shortCard]}
//             key={item.id || index}
//           >
//             <FontAwesome name={getSafeIcon(index)} size={40} color="#fff" style={styles.icon} />
//             <Text style={styles.heading}>{item.headings || "No Title"}</Text>
//             <Text style={styles.description}>{item.description || "No Description"}</Text>
//           </LinearGradient>
//         ))}
//       </View>

//       {/* Second Column */}
//       <View style={styles.column}>
//         {secondColumnData.map((item, index) => (
//           <LinearGradient
//             colors={getSafeGradient(index + 2)}
//             style={[styles.card, index === 0 ? styles.shortCard : styles.tallCard]}
//             key={item.id || index}
//           >
//             <FontAwesome name={getSafeIcon(index + 2)} size={40} color="#fff" style={styles.icon} />
//             <Text style={styles.heading}>{item.headings || "No Title"}</Text>
//             <Text style={styles.description}>{item.description || "No Description"}</Text>
//           </LinearGradient>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//     flex: 1,
//   },
//   column: {
//     flex: 1,
//   },
//   card: {
//     padding: 16,
//     margin: 8,
//     borderRadius: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
//   tallCard: {
//     height: 220,
//   },
//   shortCard: {
//     height: 170,
//   },
//   icon: {
//     marginBottom: 10,
//   },
//   heading: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 14,
//     color: 'black',
//     textAlign: 'center',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default CustomerSupportOptions;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Icon mapping array
const icons = ["car", "life-ring", "rotate-right", "lock"];

// Gradient colors for each card
const gradients = [
  ['#FF5733', '#FF8D33'], 
  ['#FC466B', '#3F5EFB'], 
  ['#3357FF', '#338DFF'], 
  ['#FF33A8', '#FF3380'],
];

const CustomerSupportOptions = ({ firstColumnData = [], secondColumnData = [] }) => {
  const getSafeGradient = (index) =>
    gradients[index % gradients.length] || ['#000', '#111'];

  const getSafeIcon = (index) =>
    icons[index % icons.length] || 'info-circle';

  return (
    <View style={styles.container}>
      {/* First Column */}
      <View style={styles.column}>
        {firstColumnData.map((item, index) => (
          <LinearGradient
            colors={getSafeGradient(index)}
            style={[styles.card, index === 0 ? styles.tallCard : styles.shortCard]}
            key={item.id || index}
          >
            <FontAwesome name={getSafeIcon(index)} size={40} color="#fff" style={styles.icon} />
            <Text style={styles.heading}>{item.headings || "No Title"}</Text>
            <Text style={styles.description}>{item.description || "No Description"}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Second Column */}
      <View style={styles.column}>
        {secondColumnData.map((item, index) => (
          <LinearGradient
            colors={getSafeGradient(index + 2)}
            style={[styles.card, index === 0 ? styles.shortCard : styles.tallCard]}
            key={item.id || index}
          >
            <FontAwesome name={getSafeIcon(index + 2)} size={40} color="#fff" style={styles.icon} />
            <Text style={styles.heading}>{item.headings || "No Title"}</Text>
            <Text style={styles.description}>{item.description || "No Description"}</Text>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    flex: 1,
  },
  column: {
    flex: 1,
  },
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  tallCard: {
    height: 220,
  },
  shortCard: {
    height: 170,
  },
  icon: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
});

export default CustomerSupportOptions;
