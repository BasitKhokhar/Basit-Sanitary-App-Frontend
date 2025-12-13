import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../Themes/colors';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PaymentMethodModal({
  visible,
  onClose,
  onCardPress,
}) {
  const [message, setMessage] = useState(null);

  const closeThen = (callback) => {
    onClose();
    setTimeout(callback, 450); // Android-safe delay
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000); // Hide after 4s
  };

  const handleManualPayment = (method) => {
    showMessage(
      `Please install the app or make payment manually from your ${method} app and upload receipt in confirm order form.`
    );
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modal, { backgroundColor: colors.cardsbackground }]}>
              <View style={[styles.handle, { backgroundColor: colors.mutedText }]} />

              <Text style={[styles.title, { color: colors.text }]}>Select Payment Method</Text>

              {/* Message Box */}
              {message && (
                <View style={[styles.messageBox, { backgroundColor: colors.error }]}>
                  <Text style={styles.messageText}>{message}</Text>
                </View>
              )}

              {/* Pay with Card */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => closeThen(onCardPress)}
              >
                <FontAwesome5 name="credit-card" size={20} color={colors.text} style={styles.icon} />
                <Text style={[styles.buttonText, { color: colors.text }]}>Pay with Card</Text>
              </TouchableOpacity>

              {/* JazzCash */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleManualPayment('JazzCash')}
              >
                <MaterialCommunityIcons name="cellphone" size={20} color={colors.text} style={styles.icon} />
                <Text style={[styles.buttonText, { color: colors.text }]}>JazzCash</Text>
              </TouchableOpacity>

              {/* EasyPaisa */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleManualPayment('EasyPaisa')}
              >
                <MaterialCommunityIcons name="cellphone" size={20} color={colors.text} style={styles.icon} />
                <Text style={[styles.buttonText, { color: colors.text }]}>EasyPaisa</Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity onPress={onClose} style={styles.cancel}>
                <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },
  messageBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  messageText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 14,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary, 
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cancel: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
