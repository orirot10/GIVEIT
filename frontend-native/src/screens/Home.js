import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const categories = [
  { id: 'tools', name: 'Tools', icon: '🔧' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'other', name: 'Other', icon: '📦' }
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://giveit-backend.onrender.com'}/api/rentals`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data.map(item => ({
        ...item,
        phone: item.phone || item.ownerPhone || 'Contact Info Unavailable'
      })));
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([
        {
          _id: '1',
          title: 'Power Drill',
          description: 'Professional power drill, barely used',
          category: 'tools',
          price: 15,
          pricePeriod: 'day',
          images: [],
          phone: '555-1234',
          status: 'available',
          city: 'Tel Aviv',
          street: 'Rothschild Blvd'
        },
        {
          _id: '2',
          title: 'Mountain Bike',
          description: 'Trek mountain bike in excellent condition',
          category: 'sports',
          price: 25,
          pricePeriod: 'day',
          images: [],
          phone: '555-5678',
          status: 'available',
          city: 'Jerusalem',
          street: 'Jaffa St'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => Alert.alert(item.title, item.description)}>
      <Image
        source={{ uri: item.images?.[0] ? `${process.env.EXPO_PUBLIC_API_URL}${item.images[0]}` : 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${item.price}/{item.pricePeriod}</Text>
          <Text style={styles.city}>{item.city}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2
  },
  image: {
    width: '100%',
    height: 150
  },
  info: {
    padding: 12
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  price: {
    color: '#2563eb',
    fontWeight: 'bold'
  },
  city: {
    color: '#666'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
