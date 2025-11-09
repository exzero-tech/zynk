import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ChargerFormData {
  name: string;
  location: string;
  status: 'available' | 'offline' | 'maintenance';
}

interface ChargerFormProps {
  initialData?: Partial<ChargerFormData>;
  onSubmit: (data: ChargerFormData) => void;
  onCancel?: () => void;
}

export function ChargerForm({ initialData = {}, onSubmit, onCancel }: ChargerFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [status, setStatus] = useState<'available' | 'offline' | 'maintenance'>(initialData.status || 'available');

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleSubmit = () => {
    if (!name || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onSubmit({ name, location, status });
  };

  const statusOptions = [
    { label: 'Available', value: 'available' as const },
    { label: 'Offline', value: 'offline' as const },
    { label: 'Maintenance', value: 'maintenance' as const },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {initialData.name ? 'Edit Charger' : 'Add New Charger'}
      </ThemedText>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: tintColor }]}
        placeholder="Charger Name"
        placeholderTextColor={textColor}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { color: textColor, borderColor: tintColor }]}
        placeholder="Location"
        placeholderTextColor={textColor}
        value={location}
        onChangeText={setLocation}
      />

      <ThemedText style={styles.label}>Status:</ThemedText>
      <ThemedView style={styles.statusContainer}>
        {statusOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.statusButton,
              { borderColor: tintColor },
              status === option.value && { backgroundColor: tintColor },
            ]}
            onPress={() => setStatus(option.value)}
          >
            <ThemedText
              style={[
                styles.statusText,
                status === option.value && { color: '#FFFFFF' },
              ]}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={handleSubmit}>
          <ThemedText style={styles.buttonText}>
            {initialData.name ? 'Update' : 'Add'} Charger
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statusButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888888',
  },
  cancelButtonText: {
    color: '#888888',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});