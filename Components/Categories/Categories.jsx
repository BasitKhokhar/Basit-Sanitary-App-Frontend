
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;
// const cardPadding = 20;
// const cardSpacing = 10;
// const cardWidth = screenWidth * 0.28;

// const Categories = ({ categoriesData }) => {
//   const [errorImageIds, setErrorImageIds] = useState({});
//   const navigation = useNavigation();

//   const renderItem = ({ item }) => {
//     const imageFailed = errorImageIds[item.id];

//     return (
//       <TouchableOpacity
//         style={{ width: cardWidth, marginRight: cardSpacing }}
//         onPress={() =>
//           navigation.navigate('Subcategories', { categoryId: item.id })
//         }
//       >
//         <View
//           style={{
//             backgroundColor: '#ffffff',
//             padding: 10,
//             borderRadius: 10,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.3,
//             shadowRadius: 4,
//             elevation: 5,
//           }}
//         >
//           {!imageFailed ? (
//             <Image
//               source={{ uri: item.image_url }}
//               style={{ width: '100%', height: 90, borderRadius: 5 }}
//               resizeMode="cover"
//               onError={() =>
//                 setErrorImageIds((prev) => ({ ...prev, [item.id]: true }))
//               }
//             />
//           ) : (
//             <View
//               style={{
//                 width: '100%',
//                 height: 90,
//                 borderRadius: 5,
//                 backgroundColor: '#ccc',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//               <Text style={{ fontSize: 12, color: '#444' }}>
//                 Image unavailable
//               </Text>
//             </View>
//           )}
//         </View>

//         <Text
//           style={{
//             fontSize: 14,
//             textAlign: 'center',
//             fontWeight: '500',
//             marginTop: 5,
//           }}
//         >
//           {item.name}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   if (!categoriesData || categoriesData.length === 0) {
//     return (
//       <View
//         style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}
//       >
//         <Text>No categories found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View
//       style={{ flex: 1, backgroundColor: '#F8F9FA', paddingVertical: 10 }}
//     >
//       <Text
//         style={{
//           fontSize: 20,
//           fontWeight: 'bold',
//           marginBottom: 20,
//           textAlign: 'center',
//         }}
//       >
//         Categories
//       </Text>

//       <FlatList
//         data={categoriesData}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: cardPadding }}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// export default Categories;
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../Themes/colors';   // ✅ THEME IMPORT

const screenWidth = Dimensions.get('window').width;
const cardSpacing = 10;
const cardWidth = screenWidth * 0.28;

const Categories = ({ categoriesData }) => {
  const [errorImageIds, setErrorImageIds] = useState({});
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const imageFailed = errorImageIds[item.id];

    return (
      <TouchableOpacity
        style={{ width: cardWidth, marginRight: cardSpacing }}
        onPress={() =>
          navigation.navigate('Subcategories', { categoryId: item.id })
        }
      >
        <View
          style={{
            backgroundColor: colors.cardsbackground,    // ✅ updated
            padding: 10,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          {!imageFailed ? (
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: '100%',
                height: 90,
                borderRadius: 5,
                backgroundColor: colors.bodybackground, // cleaner
              }}
              resizeMode="cover"
              onError={() =>
                setErrorImageIds((prev) => ({ ...prev, [item.id]: true }))
              }
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: 90,
                borderRadius: 5,
                backgroundColor: colors.secondary,      // ❗ replaced #ccc
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.mutedText,              // ❗ replaced #444
                }}
              >
                Image unavailable
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            fontWeight: '500',
            marginTop: 5,
            color: colors.text,                        // ❗ theme text
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!categoriesData || categoriesData.length === 0) {
    return (
      <View
        style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: colors.text }}>No categories found.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bodybackground,         // ❗ body background from theme
        paddingVertical: 10,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
          color: colors.text,                           // theme text color
        }}
      >
        Categories
      </Text>

      <FlatList
        data={categoriesData}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Categories;
