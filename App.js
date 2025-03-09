/**
 * FastwayApp - Fasting Tracker App
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4A6572" />
      <HomeScreen />
    </SafeAreaProvider>
  );
};

export default App;
