import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import RentalsMapPage from './src/screens/RentalsMapPage';
import ServicesMapPage from './src/screens/ServicesMapPage';
import Account from './src/screens/Account';
import Dashboard from './src/screens/Dashboard';
import EditProfile from './src/screens/EditProfile';
import Home from './src/screens/Home';
import Main2 from './src/screens/Main2';
import Messages from './src/screens/Messages';
import Login from './src/screens/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Main2')}
                  style={styles.headerLink}
                >
                  <Text style={styles.headerLinkText}>Explore</Text>
                </TouchableOpacity>
              )
            })}
          />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="Main2" component={Main2} options={{ title: 'Explore' }} />
          <Stack.Screen name="Rentals" component={RentalsMapPage} />
          <Stack.Screen name="Services" component={ServicesMapPage} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerLink: {
    marginRight: 12
  },
  headerLinkText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600'
  }
});
