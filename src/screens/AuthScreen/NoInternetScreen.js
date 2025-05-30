import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
const { width, height } = Dimensions.get('window');

const NoInternetScreen = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Modal visible={!isConnected} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Image source={require('../../../assets/images/no-wifi.png')} style={styles.logo} />
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.message}>You're offline. Please check your internet settings.</Text>
          <TouchableOpacity style={styles.button} onPress={() => NetInfo.fetch().then(state => setIsConnected(state.isConnected))}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  popup: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
    zIndex: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});