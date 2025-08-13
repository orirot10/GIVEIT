import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Messages() {
  return (
    <View style={styles.container}>
      <Text>Messages - TODO: implement messaging features</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
