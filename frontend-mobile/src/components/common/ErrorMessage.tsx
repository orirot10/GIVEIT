import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginVertical: 8,
  },
});
