
import React, { useEffect, useState, useCallback,useContext } from 'react';
import { CartContext } from '../../src/ContextApis/cartContext';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Loader from '../Loader/Loader';
import Constants from 'expo-constants';
import { colors } from "../Themes/colors";
import { apiFetch } from '../../src/apiFetch';


const CartScreen = () => {
  const { fetchCartCount } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not logged in');

      const response = await apiFetch(`/cart/cartitems`);
      if (!response.ok) throw new Error('Failed to fetch cart items');

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCartItems();
    setRefreshing(false);
  };

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cartItems]);

  const handleRemoveFromCart = async (cartId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await apiFetch(`/cart/${cartId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item');
      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
      fetchCartCount();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await apiFetch(`/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity, user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      setCartItems(prevCartItems =>
        prevCartItems.map(item =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
      fetchCartCount();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={[styles.maincontainer, { backgroundColor: colors.headerbg }]}>
      <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
        <Text style={[styles.header, { color: colors.text }]}>Your Cart</Text>

        {cartItems.length === 0 ? (
          <Text style={[styles.emptyCartText, { color: colors.mutedText }]}>Your cart is empty.</Text>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              refreshing={refreshing}
              onRefresh={handleRefresh}
              data={cartItems}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.cart_id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.cartItem, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
                  <View style={styles.productDetails}>
                    <Image source={{ uri: item.image_url }} style={styles.image} />
                    <View>
                      <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.itemPrice, { color: colors.mutedText }]}>Price: {item.price} </Text>
                      <Text style={[styles.itemTotal, { color: colors.accent }]}>Total: {item.price * item.quantity} </Text>
                    </View>
                  </View>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.cart_id, item.quantity - 1)} style={[styles.button, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.buttonText, { color: colors.text }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.cart_id, item.quantity + 1)} style={[styles.button, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.buttonText, { color: colors.text }]}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => handleRemoveFromCart(item.cart_id)} style={[styles.removeButton, { backgroundColor: colors.error }]}>
                    <Text style={[styles.buttonText, { color: colors.white }]}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        <Text style={[styles.totalAmount, { color: colors.text }]}>Total: {totalAmount} Rupees</Text>

        <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: colors.text }]} onPress={() => navigation.navigate('Checkout', { cartItems, totalAmount })}>
          <Text style={[styles.checkoutText, { color: colors.white }]}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: { paddingTop: 30, width: '100%', height: '100%' },
  container: {
    flex: 1,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
    maxHeight: 400,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productDetails: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  itemName: { fontWeight: 'bold' },
  itemPrice: { fontSize: 14 },
  itemTotal: { fontSize: 14, fontWeight: 'bold' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: { fontSize: 16, fontWeight: 'bold' },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 10,
  },
  checkoutButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: { fontSize: 16, fontWeight: 'bold' },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default CartScreen;
