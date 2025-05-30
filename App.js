import React, { useEffect, useState } from 'react';
import MainContainer from './src/navigation/MainContainer';
import { AuthProvider } from './src/context/AuthContext';
import AuthScreen from './src/navigation/AuthScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import NoInternetScreen from './src/screens/AuthScreen/NoInternetScreen';

export default function App() {
  const [correctMPIN, setCorrectMPIN] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMPIN = async () => {
      try {
        const storedMPIN = await AsyncStorage.getItem('userPin');
        setCorrectMPIN(storedMPIN); // Set the stored mPIN
      } catch (error) {
        console.error('Error fetching mPIN from AsyncStorage:', error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchMPIN();
  }, []);

  if (loading) {
    return (
      <AuthProvider>
        <MainContainer/>
        <NoInternetScreen></NoInternetScreen>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      {correctMPIN ? <AuthScreen />:<MainContainer />}
      <NoInternetScreen></NoInternetScreen>
    </AuthProvider>
  );
}
