import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { PrimaryButton } from '../../components/common';

export default function AccountScreen() {
  const { user, logout, loading } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email}</Text>
      <PrimaryButton title="Logout" onPress={logout} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  email: { marginBottom: 16, fontSize: 18 },
});
