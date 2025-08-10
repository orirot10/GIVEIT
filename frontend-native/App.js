import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import RentalsMapPage from './src/screens/RentalsMapPage';
import ServicesMapPage from './src/screens/ServicesMapPage';
import Account from './src/screens/Account';
import Dashboard from './src/screens/Dashboard';
import EditProfile from './src/screens/EditProfile';
import Home from './src/screens/Home';
import Messages from './src/screens/Messages';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="Rentals" component={RentalsMapPage} />
          <Stack.Screen name="Services" component={ServicesMapPage} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
