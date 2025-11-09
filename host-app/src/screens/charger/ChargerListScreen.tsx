import React, { useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ChargerCard } from '@/components/charger/ChargerCard';
import { RootState, AppDispatch } from '@/store';
import { fetchChargers, removeCharger, toggleStatus } from '@/store/slices/charger.slice';
import { Charger } from '@/services/api/charger.api';

export default function ChargerListScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { chargers, loading, error } = useSelector((state: RootState) => state.charger);
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    dispatch(fetchChargers());
  }, [dispatch]);

  const handleAddCharger = () => {
    router.push('/add-charger');
  };

  const handleEdit = (id: string) => {
    router.push('/edit-charger');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Charger',
      'Are you sure you want to delete this charger?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(removeCharger(id)) },
      ]
    );
  };

  const handleToggleStatus = (id: string) => {
    dispatch(toggleStatus(id));
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading chargers...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: Charger }) => (
    <ChargerCard
      charger={item}
      onEdit={() => handleEdit(item.id)}
      onDelete={() => handleDelete(item.id)}
      onToggleStatus={() => handleToggleStatus(item.id)}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Charger Dashboard</ThemedText>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: tintColor }]} onPress={handleAddCharger}>
        <ThemedText style={styles.addButtonText}>Add New Charger</ThemedText>
      </TouchableOpacity>
      <FlatList
        data={chargers}
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
});