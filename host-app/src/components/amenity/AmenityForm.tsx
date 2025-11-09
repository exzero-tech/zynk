import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface AmenityFormData {
  name: string;
  description: string;
  type: string;
  isPromoted: boolean;
}

interface AmenityFormProps {
  initialData?: Partial<AmenityFormData>;
  onSubmit: (data: AmenityFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

const amenityTypes = ['Connectivity', 'Charging', 'Facility', 'Food', 'Entertainment', 'Other'];

export function AmenityForm({ initialData = {}, onSubmit, onCancel, onDelete }: AmenityFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [type, setType] = useState(initialData.type || amenityTypes[0]);
  const [isPromoted, setIsPromoted] = useState(initialData.isPromoted || false);

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleSubmit = () => {
    if (!name || !description) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit({ name, description, type, isPromoted });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {initialData.name ? 'Edit Amenity' : 'Add New Amenity'}
      </ThemedText>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: tintColor }]}
        placeholder="Amenity Name"
        placeholderTextColor={textColor}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { color: textColor, borderColor: tintColor }]}
        placeholder="Description"
        placeholderTextColor={textColor}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <ThemedText style={styles.label}>Type:</ThemedText>
      <ThemedView style={styles.typeContainer}>
        {amenityTypes.map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.typeButton,
              { borderColor: tintColor },
              type === t && { backgroundColor: tintColor },
            ]}
            onPress={() => setType(t)}
          >
            <ThemedText
              style={[
                styles.typeText,
                type === t && { color: '#FFFFFF' },
              ]}
            >
              {t}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.promotionContainer}>
        <ThemedText style={styles.label}>Promote to attract drivers:</ThemedText>
        <Switch
          value={isPromoted}
          onValueChange={setIsPromoted}
          trackColor={{ false: '#767577', true: tintColor }}
          thumbColor={isPromoted ? '#FFFFFF' : '#f4f3f4'}
        />
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        {onDelete && (
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <ThemedText style={styles.deleteButtonText}>Delete Amenity</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={handleSubmit}>
          <ThemedText style={styles.buttonText}>
            {initialData.name ? 'Update' : 'Add'} Amenity
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  typeButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    margin: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
  },
  promotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  deleteButtonText: {
    color: '#FFFFFF',
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