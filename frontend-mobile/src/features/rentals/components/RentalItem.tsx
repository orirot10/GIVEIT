import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Rental } from '../../../types';

interface Props {
  item: Rental;
  onPress?: () => void;
}

const RentalItem = ({ item, onPress }: Props) => (
  <Pressable onPress={onPress} style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.price}>${item.price}/day</Text>
  </Pressable>
);

export default React.memo(RentalItem);

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    color: '#555',
  },
});
