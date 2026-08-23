import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LocationDetailScreen } from '../screens/LocationDetailScreen';
import { RouteViewScreen } from '../screens/RouteViewScreen';
import { ObstacleReportScreen } from '../screens/ObstacleReportScreen';

// Add new screens here as we build them (AdminDashboard, ...).
// Keep params typed so screens stay type-safe when passed ids/coords from the API.
export type RootStackParamList = {
  Home: undefined;
  LocationDetail: { id: string };
  RouteView: { id: string };
  ObstacleReport: { id?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
        <Stack.Screen name="RouteView" component={RouteViewScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="ObstacleReport" component={ObstacleReportScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
