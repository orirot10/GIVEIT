import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const sampleItems = [
  {
    id: '1',
    title: 'Vintage Bicycle',
    description: 'Refurbished city bike in great condition.',
    price: '$120',
    category: 'Mobility',
    mode: 'Offers',
    type: 'Products',
    coordinate: { latitude: 37.78825, longitude: -122.4324 },
    image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=300&q=60'
  },
  {
    id: '2',
    title: 'Garden Services',
    description: 'Monthly maintenance with plant care.',
    price: '$60',
    category: 'Services',
    mode: 'Offers',
    type: 'Services',
    coordinate: { latitude: 37.78725, longitude: -122.4314 },
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=300&q=60'
  },
  {
    id: '3',
    title: 'Home Office Desk',
    description: 'Modern oak desk with cable management.',
    price: '$90',
    category: 'Home',
    mode: 'Requests',
    type: 'Products',
    coordinate: { latitude: 37.78925, longitude: -122.4344 },
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=60'
  }
];

const categories = [
  { id: 'Mobility', icon: 'bike' },
  { id: 'Home', icon: 'sofa-single' },
  { id: 'Tech', icon: 'laptop' },
  { id: 'Services', icon: 'handshake-outline' },
  { id: 'Fashion', icon: 'tshirt-crew' }
];

const ToggleButton = ({ label, icon, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.toggleButton, active && styles.toggleButtonActive]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={active ? '#fff' : '#5A5A5A'}
        style={styles.toggleIcon}
      />
      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <TouchableOpacity style={styles.filterChip} onPress={onRemove}>
    <Text style={styles.filterChipLabel}>{label}</Text>
    <Ionicons name="close-circle" size={16} color="#4F4F4F" style={styles.filterChipIcon} />
  </TouchableOpacity>
);

export default function Main2() {
  const [activeView, setActiveView] = useState('map');
  const [filterOpen, setFilterOpen] = useState(false);
  const [offerType, setOfferType] = useState('Offers');
  const [itemType, setItemType] = useState('Products');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const mapOpacity = useRef(new Animated.Value(1)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const filterPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(mapOpacity, {
        toValue: activeView === 'map' ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(listOpacity, {
        toValue: activeView === 'list' ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
  }, [activeView, listOpacity, mapOpacity]);

  const handleToggle = (value) => {
    setActiveView(value);
  };

  const toggleFilterPanel = (open) => {
    if (open) {
      setFilterOpen(true);
      Animated.timing(filterPosition, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(filterPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start(() => setFilterOpen(false));
    }
  };

  const translateY = filterPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, SCREEN_HEIGHT * 0.3]
  });

  const filteredItems = useMemo(() => {
    return sampleItems.filter((item) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const offerTypeMatch = !offerType || item.mode === offerType;
      const itemTypeMatch = !itemType || item.type === itemType;
      return categoryMatch && offerTypeMatch && itemTypeMatch;
    });
  }, [offerType, itemType, selectedCategories]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const activeFilterTags = useMemo(() => {
    const tags = [];
    if (offerType) {
      tags.push({ type: 'offerType', value: offerType });
    }
    if (itemType) {
      tags.push({ type: 'itemType', value: itemType });
    }
    selectedCategories.forEach((cat) => tags.push({ type: 'category', value: cat }));
    return tags;
  }, [offerType, itemType, selectedCategories]);

  const handleRemoveTag = (tag) => {
    if (tag.type === 'offerType') {
      setOfferType(null);
    } else if (tag.type === 'itemType') {
      setItemType(null);
    } else if (tag.type === 'category') {
      setSelectedCategories((prev) => prev.filter((item) => item !== tag.value));
    }
  };

  const renderListItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#7B7B7B" />
          <Text style={styles.cardFooterText}>{item.category}</Text>
        </View>
      </View>
    </View>
  );

  const renderMarkerCallout = (item) => (
    <View style={styles.calloutContainer}>
      <Text style={styles.calloutTitle}>{item.title}</Text>
      <Text style={styles.calloutInfo}>{item.description}</Text>
      <Text style={styles.calloutPrice}>{item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="explore" size={28} color="#1B4B66" />
            <Text style={styles.logoText}>GiveIt</Text>
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#7B7B7B" />
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#A0A0A0"
              style={styles.searchInput}
              returnKeyType="search"
            />
            <Ionicons name="mic" size={18} color="#1B4B66" />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => toggleFilterPanel(true)}>
            <Ionicons name="options" size={22} color="#1B4B66" />
          </TouchableOpacity>
        </View>

        {activeFilterTags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTagsContainer}
          >
            {activeFilterTags.map((tag) => (
              <FilterChip key={`${tag.type}-${tag.value}`} label={tag.value} onRemove={() => handleRemoveTag(tag)} />
            ))}
          </ScrollView>
        )}

        <View style={styles.viewToggleContainer}>
          <ToggleButton
            label="Map"
            icon="map"
            active={activeView === 'map'}
            onPress={() => handleToggle('map')}
          />
          <ToggleButton
            label="List"
            icon="format-list-bulleted"
            active={activeView === 'list'}
            onPress={() => handleToggle('list')}
          />
        </View>

        <View style={styles.bodyContainer}>
          <Animated.View
            style={[styles.mapContainer, { opacity: mapOpacity }]}
            pointerEvents={activeView === 'map' ? 'auto' : 'none'}
          >
            {activeView === 'map' && (
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: sampleItems[0].coordinate.latitude,
                  longitude: sampleItems[0].coordinate.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                }}
              >
                {filteredItems.map((item) => (
                  <Marker key={item.id} coordinate={item.coordinate}>
                    <MaterialCommunityIcons name="map-marker" size={38} color="#1B4B66" />
                    <Callout tooltip>{renderMarkerCallout(item)}</Callout>
                  </Marker>
                ))}
              </MapView>
            )}
          </Animated.View>

          <Animated.View
            style={[styles.listContainer, { opacity: listOpacity }]}
            pointerEvents={activeView === 'list' ? 'auto' : 'none'}
          >
            {activeView === 'list' && (
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={renderListItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </Animated.View>
        </View>

        <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => toggleFilterPanel(false)}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => toggleFilterPanel(false)} />
          <Animated.View style={[styles.filterPanel, { transform: [{ translateY }] }]}> 
            <View style={styles.panelHandle} />
            <Text style={styles.panelTitle}>Filters</Text>

            <Text style={styles.panelSubtitle}>Mode</Text>
            <View style={styles.panelToggleRow}>
              {['Offers', 'Requests'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.panelToggle, offerType === option && styles.panelToggleActive]}
                  onPress={() =>
                    setOfferType((prev) => (prev === option ? null : option))
                  }
                >
                  <Text
                    style={[styles.panelToggleLabel, offerType === option && styles.panelToggleLabelActive]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.panelSubtitle}>Type</Text>
            <View style={styles.panelToggleRow}>
              {['Products', 'Services'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.panelToggle, itemType === option && styles.panelToggleActive]}
                  onPress={() =>
                    setItemType((prev) => (prev === option ? null : option))
                  }
                >
                  <Text
                    style={[styles.panelToggleLabel, itemType === option && styles.panelToggleLabelActive]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.panelSubtitle}>Categories</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const selected = selectedCategories.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryItem, selected && styles.categoryItemSelected]}
                    onPress={() => handleCategoryToggle(category.id)}
                  >
                    <MaterialCommunityIcons
                      name={category.icon}
                      size={24}
                      color={selected ? '#fff' : '#3F3F3F'}
                    />
                    <Text style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                      {category.id}
                    </Text>
                    <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                      {selected && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={() => toggleFilterPanel(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC'
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoText: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: '700',
    color: '#1B4B66'
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: '#F0F4F8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#333'
  },
  filterButton: {
    backgroundColor: '#E8F1F8',
    padding: 10,
    borderRadius: 16
  },
  filterTagsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  filterChip: {
    backgroundColor: '#E2EAF3',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterChipLabel: {
    fontSize: 12,
    color: '#4F4F4F'
  },
  filterChipIcon: {
    marginLeft: 4
  },
  viewToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16
  },
  toggleButtonActive: {
    backgroundColor: '#1B4B66'
  },
  toggleIcon: {
    marginRight: 6
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A5A5A'
  },
  toggleLabelActive: {
    color: '#fff'
  },
  bodyContainer: {
    flex: 1,
    marginTop: 12
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4
  },
  listContent: {
    paddingBottom: 120
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12
  },
  cardContent: {
    flex: 1
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B1B1B'
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B4B66'
  },
  cardDescription: {
    marginTop: 4,
    fontSize: 13,
    color: '#4F4F4F'
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  cardFooterText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#7B7B7B'
  },
  calloutContainer: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B1B1B'
  },
  calloutInfo: {
    marginTop: 4,
    fontSize: 12,
    color: '#4F4F4F'
  },
  calloutPrice: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#1B4B66'
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#1B4B66',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  filterPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    minHeight: SCREEN_HEIGHT * 0.4
  },
  panelHandle: {
    alignSelf: 'center',
    width: 52,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D0D7DF',
    marginBottom: 16
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B1B1B'
  },
  panelSubtitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4F4F4F'
  },
  panelToggleRow: {
    flexDirection: 'row',
    gap: 12
  },
  panelToggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#EEF2F7',
    alignItems: 'center'
  },
  panelToggleActive: {
    backgroundColor: '#1B4B66'
  },
  panelToggleLabel: {
    fontSize: 14,
    color: '#4F4F4F'
  },
  panelToggleLabelActive: {
    color: '#fff'
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#F1F4F8',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryItemSelected: {
    backgroundColor: '#1B4B66'
  },
  categoryLabel: {
    marginTop: 10,
    fontSize: 13,
    color: '#3F3F3F',
    fontWeight: '600'
  },
  categoryLabelSelected: {
    color: '#fff'
  },
  checkbox: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1B4B66',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  checkboxChecked: {
    backgroundColor: '#1B4B66',
    borderColor: '#1B4B66'
  },
  applyButton: {
    marginTop: 24,
    backgroundColor: '#1B4B66',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center'
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  }
});
