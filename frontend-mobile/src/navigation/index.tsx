import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../features/auth/AuthContext';
import LoginScreen from '../features/auth/LoginScreen';
import HomeScreen from '../features/rentals/HomeScreen';
import RentalDetailsScreen from '../features/rentals/RentalDetailsScreen';
import AccountScreen from '../features/account/AccountScreen';

const Auth = createNativeStackNavigator();
function AuthStack() {
  return (
    <Auth.Navigator>
      <Auth.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Auth.Navigator>
  );
}

const Home = createNativeStackNavigator();
function HomeStack() {
  return (
    <Home.Navigator>
      <Home.Screen name="Home" component={HomeScreen} options={{ title: 'Rentals' }} />
      <Home.Screen name="RentalDetails" component={RentalDetailsScreen} options={{ title: 'Details' }} />
    </Home.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ headerShown: false, title: 'Home' }} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const Root = createNativeStackNavigator();
export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return null; // Could render splash screen
  }
  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Root.Screen name="Main" component={MainTabs} />
      ) : (
        <Root.Screen name="Auth" component={AuthStack} />
      )}
    </Root.Navigator>
  );
}
