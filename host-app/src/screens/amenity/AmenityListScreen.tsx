import React, { useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RootState, AppDispatch } from '@/store';
import { fetchAmenities, removeAmenity, toggleAmenityPromotionThunk } from '@/store/slices/amenity.slice';
import { Amenity } from '@/services/api/amenity.api';

export default function AmenityListScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { amenities, loading, error } = useSelector((state: RootState) => state.amenity);
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  const handleAddAmenity = () => {
    router.push('/add-amenity');
  };

  const handleEdit = (id: string) => {
    router.push('/edit-amenity');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Amenity',
      'Are you sure you want to delete this amenity?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          dispatch(removeAmenity(id));
        }},
      ]
    );
  };

  const handleTogglePromotion = (id: string) => {
    dispatch(toggleAmenityPromotionThunk(id));
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
        data={amenities}
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