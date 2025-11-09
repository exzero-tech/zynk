import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface Amenity {
  id: string;
  name: string;
  description: string;
  type: string;
  isPromoted: boolean;
}

// Dummy data
const dummyAmenities: Amenity[] = [
  { id: '1', name: 'Free WiFi', description: 'High-speed internet access', type: 'Connectivity', isPromoted: true },
  { id: '2', name: 'EV Charging', description: 'Fast electric vehicle charging', type: 'Charging', isPromoted: false },
  { id: '3', name: 'Restrooms', description: 'Clean and accessible facilities', type: 'Facility', isPromoted: true },
];

export default function AmenityListScreen() {
  const tintColor = useThemeColor({}, 'tint');

  const handleAddAmenity = () => {
    console.log('Add amenity');
    // TODO: Navigate to add screen
  };

  const handleEdit = (id: string) => {
    console.log('Edit amenity', id);
    // TODO: Navigate to edit screen
  };

  const handleDelete = (id: string) => {
    console.log('Delete amenity', id);
    // TODO: Show confirmation and delete
  };

  const handleTogglePromotion = (id: string) => {
    console.log('Toggle promotion', id);
    // TODO: Update promotion
  };

  const renderItem = ({ item }: { item: Amenity }) => (
    <TouchableOpacity style={[styles.card, { borderColor: tintColor }]}>
      <ThemedText type="subtitle" style={styles.name}>{item.name}</ThemedText>
      <ThemedText style={styles.description}>{item.description}</ThemedText>
      <ThemedText style={styles.type}>Type: {item.type}</ThemedText>
      {item.isPromoted && <ThemedText style={[styles.promoted, { color: tintColor }]}>⭐ Promoted</ThemedText>}
      <ThemedView style={styles.actions}>
        <TouchableOpacity style={[styles.button, { borderColor: tintColor }]} onPress={() => handleEdit(item.id)}>
          <ThemedText style={{ color: tintColor }}>Edit</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { borderColor: tintColor }]} onPress={() => handleDelete(item.id)}>
          <ThemedText style={{ color: tintColor }}>Delete</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { borderColor: tintColor }]} onPress={() => handleTogglePromotion(item.id)}>
          <ThemedText style={{ color: tintColor }}>{item.isPromoted ? 'Unpromote' : 'Promote'}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Amenity Management</ThemedText>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: tintColor }]} onPress={handleAddAmenity}>
        <ThemedText style={styles.addButtonText}>Add New Amenity</ThemedText>
      </TouchableOpacity>
      <FlatList
        data={dummyAmenities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  type: {
    fontSize: 14,
    marginTop: 4,
  },
  promoted: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
});