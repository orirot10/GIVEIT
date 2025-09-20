import React, { useState, useEffect } from 'react';
import BaseScreen from '../components/BaseScreen';
import '../styles/components/BaseScreen.css';

const BaseScreenExample = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        title: 'Electric Drill',
        description: 'Professional electric drill for rent',
        price: 50,
        pricePeriod: 'day',
        category: 'Tools',
        city: 'Tel Aviv',
        lat: 32.0853,
        lng: 34.7818,
        images: [],
        rating: 4.5,
        type: 'rental'
      },
      {
        id: 2,
        title: 'Laptop Repair',
        description: 'Professional laptop repair service',
        price: 150,
        pricePeriod: 'service',
        category: 'Repair',
        city: 'Jerusalem',
        lat: 31.7683,
        lng: 35.2137,
        images: [],
        rating: 4.8,
        type: 'service'
      },
      {
        id: 3,
        title: 'Mountain Bike',
        description: 'High-quality mountain bike for outdoor adventures',
        price: 80,
        pricePeriod: 'day',
        category: 'Sports',
        city: 'Haifa',
        lat: 32.7940,
        lng: 34.9896,
        images: [],
        rating: 4.2,
        type: 'rental'
      }
    ];
    
    setItems(mockItems);
    setFilteredItems(mockItems);
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredItems(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = items;

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(item =>
        filters.categories.includes(item.category)
      );
    }

    setFilteredItems(filtered);
  };

  return (
    <BaseScreen
      items={filteredItems}
      contentType="rental"
      onSearch={handleSearch}
      onFilter={handleFilter}
    />
  );
};

export default BaseScreenExample;