import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuthContext } from '../context/AuthContext';

export default function Account({ navigation }) {
  const { user, logout } = useAuthContext();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please log in to view your account</Text>
        <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logged in as {user.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  title: {
    fontSize: 16,
    marginBottom: 16
  }
});
