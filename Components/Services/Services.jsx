// // import React, { useEffect, useState } from 'react';
// // import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
// // import Loader from '../Loader/Loader';

// // import Constants from 'expo-constants';
// // const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// // const Services = () => {
// //     const [activeTab, setActiveTab] = useState(0);
// //     const [servicesData, setServicesData] = useState([]);
// //     const [plumbersData, setPlumbersData] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [refreshing, setRefreshing] = useState(false);

// //     const fetchData = async () => {
// //         try {
// //             const [servicesRes, plumbersRes] = await Promise.all([
// //                 fetch(`${API_BASE_URL}/services`).then(res => res.json()),
// //                 fetch(`${API_BASE_URL}/plumbers`).then(res => res.json())
// //             ]);
// //             setServicesData(servicesRes);
// //             setPlumbersData(plumbersRes);
// //         } catch (error) {
// //             console.error('Error fetching data:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         setLoading(true);
// //         fetchData();
// //     }, []);

// //     const handleRefresh = () => {
// //         setRefreshing(true);
// //         fetchData();
// //         setRefreshing(false);
// //     };


// //     if (loading) {
// //         return (<View style={styles.loaderContainer}>
// //             <Loader />
// //         </View>)
// //     }

// //     return (
// //         <View style={{ paddingBottom: 110 }}>
// //             <FlatList
// //                 key={"single-column"}
// //                 data={plumbersData}
// //                 showsVerticalScrollIndicator={false}
// //                 keyExtractor={(item) => item.id.toString()}
// //                 numColumns={1}
// //                 refreshing={refreshing}
// //                 onRefresh={handleRefresh}
// //                 ListHeaderComponent={
// //                     <View style={styles.maincontainer}>
// //                         <View style={styles.servicescontainer}>
// //                             <Text style={styles.heading}>Services</Text>
// //                             <Text style={styles.subHeading}>Explore Our Services</Text>

// //                             <View style={styles.serviceContainer}>
// //                                 {/* Left Navigation */}
// //                                 <View style={styles.navContainer}>
// //                                     {servicesData.map((service, index) => (
// //                                         <TouchableOpacity
// //                                             key={service.id}
// //                                             style={[styles.navButton, activeTab === index && styles.activeNavButton]}
// //                                             onPress={() => setActiveTab(index)}>
// //                                             <Text style={[styles.navText, activeTab === index && styles.activeNavText]}>{service.title}</Text>
// //                                         </TouchableOpacity>
// //                                     ))}
// //                                 </View>

// //                                 {/* Right Content */}
// //                                 <View style={styles.contentContainer}>
// //                                     {servicesData.length > 0 && (
// //                                         <View>
// //                                             <Image source={{ uri: servicesData[activeTab].image }} style={styles.image} />
// //                                             <Text style={styles.serviceTitle}>10+ Years Of Experience In Sanitary & Plumbing Services</Text>
// //                                             <Text style={styles.serviceDescription}>{servicesData[activeTab].description}</Text>
// //                                         </View>
// //                                     )}
// //                                 </View>
// //                             </View>

// //                             <Text style={styles.subHeading}>Our Plumbers</Text>
// //                         </View>
// //                     </View>

// //                 }
// //                 renderItem={({ item }) => (
// //                     <View style={styles.cardscontainer}>
// //                         <View style={styles.card}>
// //                             <View style={styles.cardimage}>
// //                                 <Image source={{ uri: item.image_url }} style={styles.plumberImage} />
// //                             </View>
// //                             <View style={styles.cardright}>
// //                                 <Text style={styles.cardTitle}>Name: {item.name}</Text>
// //                                 <Text style={styles.cardText}>Contact: {item.contact}</Text>
// //                                 <Text style={[styles.status, styles[item.status.toLowerCase().replace(' ', '')]]}>{item.status}</Text>
// //                             </View>
// //                         </View>
// //                     </View>

// //                 )}
// //             />
// //         </View>

// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: { flex: 1, padding: 16, backgroundColor: 'black' },
// //     loaderContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         width: '100%',
// //         height: '100%',
// //         borderRadius: 10,
// //         backgroundColor: '#fff',
// //     },
// //     loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //     maincontainer: { backgroundColor: '#1A1A1A', paddingTop: 30 },
// //     servicescontainer: { backgroundColor: '#F8F9FA', borderTopLeftRadius: 0, borderTopRightRadius: 70 },
// //     heading: { fontSize: 28, fontWeight: 'bold', marginTop: 40, textAlign: 'center' },
// //     subHeading: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
// //     serviceContainer: { flexDirection: 'column', marginBottom: 20, padding: 15 },
// //     navContainer: { width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 10 },
// //     navButton: { padding: 10, width: '31%', borderWidth: 2, borderRadius: 10, borderColor: 'black', backgroundColor: '#f8f8f8' },
// //     activeNavButton: { backgroundColor: '#282828' },
// //     navText: { fontSize: 16, textAlign: 'center' },
// //     activeNavText: { color: '#fff' },
// //     contentContainer: { width: '100%' },
// //     image: { width: '100%', height: 150, borderRadius: 10 },
// //     serviceTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
// //     serviceDescription: { fontSize: 14, marginTop: 5, color: '#666' },

// //     card: { flex: 1, flexDirection: "row", gap: 20, padding: 10, marginHorizontal: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, margin: 5, alignItems: 'center' },
// //     cardimage: {},
// //     cardright: {},
// //     plumberImage: { width: 100, height: 100, borderRadius: 0, marginBottom: 10 },
// //     cardTitle: { fontSize: 16, fontWeight: 'bold' },
// //     cardText: { fontSize: 14, color: '#666' },
// //     status: { color: "green", fontWeight: "800" }
// // });

// // export default Services;
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Image, FlatList, Alert, StyleSheet } from 'react-native';
// import Loader from '../Loader/Loader';
// import Constants from 'expo-constants';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from '@react-navigation/native';
// import { colors } from '../Themes/colors';

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const Services = () => {
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState(0);
//   const [servicesData, setServicesData] = useState([]);
//   const [plumbersData, setPlumbersData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loginUserId, setLoginUserId] = useState(null);

//   const fetchData = async () => {
//     try {
//       const [servicesRes, plumbersRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/services`).then(res => res.json()),
//         fetch(`${API_BASE_URL}/plumbers`).then(res => res.json())
//       ]);

//       setServicesData(servicesRes);
//       setPlumbersData(plumbersRes);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUserId = async () => {
//     try {
//       const id = await AsyncStorage.getItem("userId");
//       if (id) setLoginUserId(id);
//     } catch (err) {
//       console.log("Error fetching userId", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     getUserId();
//   }, []);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//     setRefreshing(false);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <Loader />
//       </View>
//     );
//   }

//   return (
//     <View style={{ paddingBottom: 110, backgroundColor: colors.bodybackground }}>
//       <FlatList
//         data={plumbersData}
//         showsVerticalScrollIndicator={false}
//         keyExtractor={item => item.id.toString()}
//         refreshing={refreshing}
//         onRefresh={handleRefresh}
//         ListHeaderComponent={
//          <View style={styles.maincontainer}>
//            <View style={styles.servicescontainer} >
//             <Text style={[styles.heading, { color: colors.text,marginTop:15 }]}>Services</Text>
//             <Text style={[styles.subHeading, { color: colors.text }]}>Explore Our Services</Text>

//             <View style={styles.navContainer}>
//               {servicesData.map((service, index) => (
//                 <TouchableOpacity
//                   key={service.id}
//                   style={[
//                     styles.navButton,
//                     { backgroundColor: colors.secondary, borderColor: colors.border },
//                     activeTab === index && { backgroundColor: colors.text }
//                   ]}
//                   onPress={() => setActiveTab(index)}
//                 >
//                   <Text style={[
//                     styles.navText,
//                     { color: colors.text },
//                     activeTab === index && { color: colors.white }
//                   ]}>
//                     {service.title}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {servicesData.length > 0 && (
//               <View style={styles.contentContainer}>
//                 <Image source={{ uri: servicesData[activeTab].image }} style={styles.image} />
//                 <Text style={[styles.serviceTitle, { color: colors.text }]}>
//                   10+ Years Of Experience In Sanitary & Plumbing Services
//                 </Text>
//                 <Text style={[styles.serviceDescription, { color: colors.mutedText }]}>
//                   {servicesData[activeTab].description}
//                 </Text>
//               </View>
//             )}

//             <Text style={[styles.subHeading, { color: colors.text,marginBottom:10 }]}>Our Plumbers</Text>
//           </View>
//          </View>
//         }

//         renderItem={({ item }) => {
//           const isAvailable =
//             item.status.toLowerCase() === "free" ||
//             item.status.toLowerCase() === "available";

//           return (
//             <View style={styles.cardscontainer}>
//               <View style={[styles.card, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
//                 <Image source={{ uri: item.image_url }} style={styles.plumberImage} />

//                 <View style={styles.cardright}>
//                   <Text style={[styles.cardTitle, { color: colors.text }]}>Name: {item.name}</Text>
//                   <Text style={[styles.cardText, { color: colors.mutedText }]}>Contact: {item.contact}</Text>

//                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Text
//                     style={[
//                       styles.status,
//                       { color: item.status.toLowerCase() === 'free' ? 'green' : colors.error }
//                     ]}
//                   >
//                     {item.status}
//                   </Text>

//                   {/* ✅ Show BOOK button only if status is FREE */}
//                   {item.status.toLowerCase() === "free" && (
//                     <TouchableOpacity
//                       style={styles.bookButton}
//                       onPress={() => {
//                         if (!loginUserId) {
//                           Alert.alert('Error', 'User not logged in');
//                           return;
//                         }
//                         navigation.navigate('BookingForm', {
//                           technicianId: item.id,
//                           techuserID: item.id,
//                           loginUserId: loginUserId,
//                         });
//                       }}
//                     >
//                       <Text style={styles.bookButtonText}>Book</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//                 </View>
//               </View>
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   maincontainer: { backgroundColor: '#1A1A1A', paddingTop: 30 },
//     servicescontainer: { backgroundColor: '#F8F9FA', borderTopLeftRadius: 0, borderTopRightRadius: 70 },
//   heading: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
//   subHeading: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 20 },
//   navContainer: { flexDirection: "row", gap: 10, padding: 15, justifyContent: 'space-between' },
//   navButton: { padding: 10, width: "31%", borderWidth: 1, borderRadius: 10 },
//   navText: { textAlign: "center", fontSize: 16 },
//   contentContainer: { padding: 15 },
//   image: { width: "100%", height: 150, borderRadius: 10 },
//   serviceTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
//   serviceDescription: { fontSize: 14, marginTop: 5 },

//   cardscontainer: { marginBottom: 10 },
//   card: { flexDirection: "row", padding: 10, borderWidth: 1, borderRadius: 8, marginHorizontal: 15, gap: 15 },
//   plumberImage: { width: 100, height: 100, borderRadius: 10 },

//   cardright: { flex: 1 },
//   cardTitle: { fontSize: 16, fontWeight: "bold" },
//   cardText: { fontSize: 14 },
//   status: { fontWeight: "700", marginTop: 5 },

//   bookButton: {
//      marginTop: 10, backgroundColor: colors.primary,
//     paddingVertical: 8, paddingHorizontal: 30,
//     borderRadius: 8, alignItems: 'center'
//   },
//   bookButtonText: { color: "white", fontWeight: "bold" }
// });

// export default Services;

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert, StyleSheet } from 'react-native';
import Loader from '../Loader/Loader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../Themes/colors';
import { apiFetch } from '../../src/apiFetch'; // your helper file

const Services = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [servicesData, setServicesData] = useState([]);
  const [plumbersData, setPlumbersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);

  const fetchData = async () => {
    try {
      const [servicesRes, plumbersRes] = await Promise.all([
        apiFetch('/services/getservices'),
        apiFetch('/services/getplumbers'),
      ]);

      const servicesJson = await servicesRes.json();
      const plumbersJson = await plumbersRes.json();

      setServicesData(servicesJson);
      setPlumbersData(plumbersJson);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert("Error", "Failed to fetch services or plumbers");
    } finally {
      setLoading(false);
    }
  };

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) setLoginUserId(id);
    } catch (err) {
      console.log("Error fetching userId", err);
    }
  };

  useEffect(() => {
    fetchData();
    getUserId();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };
 console.log("services data",servicesData)
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 110, backgroundColor: colors.bodybackground }}>
      <FlatList
        data={plumbersData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View style={styles.maincontainer}>
            <View style={styles.servicescontainer}>
              <Text style={[styles.heading, { color: colors.text, marginTop: 15 }]}>Services</Text>
              <Text style={[styles.subHeading, { color: colors.text }]}>Explore Our Services</Text>

              <View style={styles.navContainer}>
                {servicesData.map((service, index) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[
                      styles.navButton,
                      { backgroundColor: colors.secondary, borderColor: colors.border },
                      activeTab === index && { backgroundColor: colors.text }
                    ]}
                    onPress={() => setActiveTab(index)}
                  >
                    <Text style={[
                      styles.navText,
                      { color: colors.text },
                      activeTab === index && { color: colors.white }
                    ]}>
                      {service.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {servicesData.length > 0 && (
                <View style={styles.contentContainer}>
                  <Image source={{ uri: servicesData[activeTab].image }} style={styles.image} />
                  <Text style={[styles.serviceTitle, { color: colors.text }]}>
                    10+ Years Of Experience In Sanitary & Plumbing Services
                  </Text>
                  <Text style={[styles.serviceDescription, { color: colors.mutedText }]}>
                    {servicesData[activeTab].description}
                  </Text>
                </View>
              )}

              <Text style={[styles.subHeading, { color: colors.text, marginBottom: 10 }]}>Our Plumbers</Text>
            </View>
          </View>
        }

        renderItem={({ item }) => {
          const isAvailable = item.status.toLowerCase() === "free" || item.status.toLowerCase() === "available";

          return (
            <View style={styles.cardscontainer}>
              <View style={[styles.card, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
                <Image source={{ uri: item.image_url }} style={styles.plumberImage} />
                <View style={styles.cardright}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Name: {item.name}</Text>
                  <Text style={[styles.cardText, { color: colors.mutedText }]}>Contact: {item.contact}</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[
                      styles.status,
                      { color: item.status.toLowerCase() === 'free' ? 'green' : colors.error }
                    ]}>
                      {item.status}
                    </Text>

                    {item.status.toLowerCase() === "free" && (
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => {
                          if (!loginUserId) {
                            Alert.alert('Error', 'User not logged in');
                            return;
                          }
                          navigation.navigate('bookplumber', {
                            technicianId: item.id,
                            techuserID: item.id,
                            loginUserId: loginUserId,
                          });
                        }}
                      >
                        <Text style={styles.bookButtonText}>Book</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  maincontainer: { backgroundColor: '#1A1A1A', paddingTop: 30 },
  servicescontainer: { backgroundColor: '#F8F9FA', borderTopLeftRadius: 0, borderTopRightRadius: 70 },
  heading: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  subHeading: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 20 },
  navContainer: { flexDirection: "row", gap: 10, padding: 15, justifyContent: 'space-between' },
  navButton: { padding: 10, width: "31%", borderWidth: 1, borderRadius: 10 },
  navText: { textAlign: "center", fontSize: 16 },
  contentContainer: { padding: 15 },
  image: { width: "100%", height: 150, borderRadius: 10 },
  serviceTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  serviceDescription: { fontSize: 14, marginTop: 5 },
  cardscontainer: { marginBottom: 10 },
  card: { flexDirection: "row", padding: 10, borderWidth: 1, borderRadius: 8, marginHorizontal: 15, gap: 15 },
  plumberImage: { width: 100, height: 100, borderRadius: 10 },
  cardright: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardText: { fontSize: 14 },
  status: { fontWeight: "700", marginTop: 5 },
  bookButton: {
    marginTop: 10, backgroundColor: colors.primary,
    paddingVertical: 8, paddingHorizontal: 30,
    borderRadius: 8, alignItems: 'center'
  },
  bookButtonText: { color: "white", fontWeight: "bold" }
});

export default Services;
