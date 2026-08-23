import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LocationDetailScreen } from '../screens/LocationDetailScreen';

// Add new screens here as we build them (RouteView, ObstacleReport, AdminDashboard, ...).
// Keep params typed so screens stay type-safe when passed ids/coords from the API.
export type RootStackParamList = {
  Home: undefined;
  LocationDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
