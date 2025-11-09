import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions | null;
}

export interface FilterOptions {
  chargerSpeed: string[];
  socketType: string[];
  availability: string;
  amenities: string[];
}

const CHARGER_SPEEDS = ['Slow (3-7 kW)', 'Fast (7-22 kW)', 'Rapid (43-50 kW)', 'Ultra-Rapid (150+ kW)'];
const SOCKET_TYPES = ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'];
const AVAILABILITY_OPTIONS = ['All', 'Available Now', 'Reserved'];
const AMENITIES = [
  '📶 WiFi',
  '🚻 Restrooms',
  '🍽️ Restaurant',
  '🛍️ Shopping',
  '🅿️ Parking',
  '☕ Coffee Shop',
  '🔌 EV Lounge',
  '🏪 Convenience Store',
  '🏬 Malls',
  '📚 Libraries',
];

export function FilterModal({ visible, onClose, onApplyFilters, currentFilters }: FilterModalProps) {
  const [chargerSpeed, setChargerSpeed] = useState<string[]>([]);
  const [socketType, setSocketType] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>('All');
  const [amenities, setAmenities] = useState<string[]>([]);

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');

  // Sync with currentFilters when modal opens
  React.useEffect(() => {
    if (visible && currentFilters) {
      setChargerSpeed(currentFilters.chargerSpeed || []);
      setSocketType(currentFilters.socketType || []);
      setAvailability(currentFilters.availability || 'All');
      setAmenities(currentFilters.amenities || []);
    }
  }, [visible, currentFilters]);

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      chargerSpeed,
      socketType,
      availability,
      amenities,
    });
    onClose();
  };

  const handleReset = () => {
    setChargerSpeed([]);
    setSocketType([]);
    setAvailability('All');
    setAmenities([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Filters</ThemedText>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <ThemedText style={styles.resetText}>Reset</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Charger Speed */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Charger Speed</ThemedText>
            <View style={styles.optionsGrid}>
              {CHARGER_SPEEDS.map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.chip,
                    { backgroundColor: cardColor },
                    chargerSpeed.includes(speed) && { backgroundColor: tintColor },
                  ]}
                  onPress={() => toggleSelection(speed, chargerSpeed, setChargerSpeed)}
                >
                  <ThemedText style={styles.chipText}>{speed}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Socket Type */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Socket Type</ThemedText>
            <View style={styles.optionsGrid}>
              {SOCKET_TYPES.map((socket) => (
                <TouchableOpacity
                  key={socket}
                  style={[
                    styles.chip,
                    { backgroundColor: cardColor },
                    socketType.includes(socket) && { backgroundColor: tintColor },
                  ]}
                  onPress={() => toggleSelection(socket, socketType, setSocketType)}
                >
                  <ThemedText style={styles.chipText}>{socket}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Availability</ThemedText>
            <View style={styles.optionsGrid}>
              {AVAILABILITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.chip,
                    { backgroundColor: cardColor },
                    availability === option && { backgroundColor: tintColor },
                  ]}
                  onPress={() => setAvailability(option)}
                >
                  <ThemedText style={styles.chipText}>{option}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Amenities</ThemedText>
            <View style={styles.optionsGrid}>
              {AMENITIES.map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.chip,
                    { backgroundColor: cardColor },
                    amenities.includes(amenity) && { backgroundColor: tintColor },
                  ]}
                  onPress={() => toggleSelection(amenity, amenities, setAmenities)}
                >
                  <ThemedText style={styles.chipText}>{amenity}</ThemedText>
                  {amenities.includes(amenity) && (
                    <MaterialIcons name="check" size={16} color="#FFFFFF" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: tintColor }]}
            onPress={handleApply}
          >
            <ThemedText style={styles.applyButtonText}>Apply Filters</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resetText: {
    fontSize: 16,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 4,
  },
  spacer: {
    height: 100,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
