import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Rental } from '../../types';

export default function RentalDetailsScreen({ route }: { route: RouteProp<any> }) {
  const { rental } = route.params as { rental: Rental };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: rental.image }} style={styles.image} />
      <Text style={styles.title}>{rental.title}</Text>
      <Text style={styles.price}>${rental.price}/day</Text>
      <Text style={styles.description}>{rental.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 200, borderRadius: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  price: { fontSize: 18, marginBottom: 8 },
  description: { fontSize: 16 },
});
