import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BeloteGame, createDeck } from './src/game/GameLogic';
import Card from './src/components/Card';
import { useTranslation } from 'react-i18next';
//import 'react-native-set-immediate';
import 'core-js/stable/set-immediate';


if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (callback, ...args) => setTimeout(callback, 0, ...args);
}

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


import * as ScreenOrientation from 'expo-screen-orientation';
import RoomManager from './src/components/RoomManager';
import GameScreen from './src/screens/GameScreen';

const lockToLandscape = async () => {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
};
 const Stack = createStackNavigator();



  // Initialize the game
 


  export default function App() {
     useEffect(() => {
    
    
    lockToLandscape();
  }, []);
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Room" component={RoomManager} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }