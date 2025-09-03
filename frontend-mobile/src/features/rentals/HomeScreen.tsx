import React, { useCallback } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import useRentals from './hooks/useRentals';
import RentalItem from './components/RentalItem';
import { Rental } from '../../types';

export default function HomeScreen({ navigation }: any) {
  const { data, loading } = useRentals();

  const handlePress = useCallback(
    (item: Rental) => {
      navigation.navigate('RentalDetails', { rental: item });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Rental }) => (
      <RentalItem item={item} onPress={() => handlePress(item)} />
    ),
    [handlePress]
  );

  const keyExtractor = useCallback((item: Rental) => item.id, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
  );
}
