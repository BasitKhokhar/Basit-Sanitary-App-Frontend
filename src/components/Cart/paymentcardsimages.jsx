import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, ActivityIndicator, Dimensions } from "react-native";

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const { width } = Dimensions.get("window");

const Paymentcardimages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/images`) 
            .then((response) => response.json())
            .then((data) => {
                setImages(data);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching images:", error));
    }, []);
   console.log("card images",images)
    if (loading) {
        return <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 20 }} />;
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10 }}>
            {images && images.map((item) => (
                <View key={item.id} style={{ marginRight: 10 }}>
                    <Image
                        source={{ uri: item.image_url }}
                        style={{
                            width: width / 8, 
                            height: 35,
                            borderRadius: 5,
                            backgroundColor: "black",
                        }}
                        resizeMode="cover"
                    />
                </View>
            ))}
        </ScrollView>
    );
};

export default Paymentcardimages;
