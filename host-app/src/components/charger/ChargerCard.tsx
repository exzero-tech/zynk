import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface Charger {
  id: string;
  name: string;
  status: 'available' | 'offline' | 'maintenance';
  location: string;
}

interface ChargerCardProps {
  charger: Charger;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export function ChargerCard({ charger, onPress, onEdit, onDelete, onToggleStatus }: ChargerCardProps) {
  const cardColor = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#00BC74';
      case 'offline': return '#888888';
      case 'maintenance': return '#FF6B6B';
      default: return '#888888';
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: cardColor }]} onPress={onPress}>
      <ThemedText type="subtitle" style={styles.name}>{charger.name}</ThemedText>
      <ThemedText style={styles.location}>{charger.location}</ThemedText>
      <ThemedText style={[styles.status, { color: getStatusColor(charger.status) }]}>
        Status: {charger.status}
      </ThemedText>
      <ThemedView style={styles.actions}>
        <TouchableOpacity style={[styles.button, { borderColor: tintColor }]} onPress={onEdit}>
          <ThemedText style={{ color: tintColor }}>Edit</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { borderColor: tintColor }]} onPress={onDelete}>
          <ThemedText style={{ color: tintColor }}>Delete</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { borderColor: tintColor }]} onPress={onToggleStatus}>
          <ThemedText style={{ color: tintColor }}>Toggle</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    marginTop: 4,
  },
  status: {
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