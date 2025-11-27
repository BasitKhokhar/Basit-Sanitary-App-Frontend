// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // For icons
// import Loader from "../Loader/Loader";
// import { useNavigation } from "@react-navigation/native";
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const FAQ = () => {

//     const navigation = useNavigation();
//     const [faqs, setFaqs] = useState([]);
//     const [expandedIndex, setExpandedIndex] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchFAQs();
//     }, []);

//     const fetchFAQs = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/faqs`); // Replace with your API URL
//             const data = await response.json();
//             setFaqs(data);
//         } catch (error) {
//             console.error("Error fetching FAQs:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//           console.log("FAqs",faqs)
//     const toggleExpand = (index) => {
//         setExpandedIndex(expandedIndex === index ? null : index);
//     };

//     return (
//         <ScrollView style={{ flex: 1, backgroundColor: "#F8F9FA", padding: 20 }}>
//             <Text style={{ fontSize: 24, fontWeight: "bold", color: "black", marginBottom: 10, textAlign: "center" }}>
//                 Frequently Asked Questions
//             </Text>

//             {loading ? (
//                 <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',borderRadius: 10,backgroundColor: '#fff',}}>
//                     <Loader />
//                 </View>
//             ) : (
//                 faqs.map((faq, index) => (
//                     <View key={faq.id} style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden", backgroundColor: "#222", elevation: 4 }}>
//                         <TouchableOpacity
//                             onPress={() => toggleExpand(index)}
//                             style={{
//                                 flexDirection: "row",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 padding: 15,
//                                 backgroundColor: "#FFFFFF",
//                                 borderTopLeftRadius: 10,
//                                 borderTopRightRadius: 10,
//                             }}
//                         >
//                             <Text style={{ fontSize: 16, fontWeight: "bold", color: "black", flex: 1 }}>{faq.question}</Text>
//                             <Ionicons
//                                 name={expandedIndex === index ? "chevron-up-outline" : "chevron-down-outline"}
//                                 size={22}
//                                 color="black"
//                             />
//                         </TouchableOpacity>

//                         {expandedIndex === index && (
//                             <View style={{ backgroundColor: "#444", padding: 15 }}>
//                                 <Text style={{ fontSize: 14, color: "#FFF", lineHeight: 20 }}>{faq.answer}</Text>
//                             </View>
//                         )}
//                     </View>
//                 ))
//             )}
//         </ScrollView>
//     );
// };

// export default FAQ;
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../Loader/Loader";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { colors } from "../Themes/colors";

import { apiFetch } from "../../src/apiFetch";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const FAQ = () => {
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Fetch FAQs from backend
  const fetchFAQs = async () => {
    try {
      const response = await apiFetch(`/content/faqs`);
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setErrorMsg("No FAQs available at the moment.");
      } else {
        setFaqs(data);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setErrorMsg("Unable to load FAQs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.bodybackground,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
      }}
    >
      {/* Loading State */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80%",
          }}
        >
          <Loader />
        </View>
      ) : errorMsg ? (
        /* No Data or Error Message */
        <View
          style={{
            padding: 20,
            backgroundColor: colors.cardsbackground,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={50}
            color={colors.mutedText}
            style={{ marginBottom: 15 }}
          />
          <Text
            style={{
              color: colors.mutedText,
              fontSize: 16,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            {errorMsg}
          </Text>
        </View>
      ) : (
        /* FAQs List */
        faqs.map((faq, index) => (
          <View
            key={faq.id}
            style={{
              marginBottom: 12,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: colors.headerbg,
              elevation: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                backgroundColor: colors.cardsbackground,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.text,
                  flex: 1,
                  marginRight: 10,
                }}
              >
                {faq.question}
              </Text>

              <Ionicons
                name={
                  expandedIndex === index
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <View
                style={{
                  backgroundColor: colors.formbg,
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.white,
                    lineHeight: 20,
                  }}
                >
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default FAQ;
