import { StyleSheet, View, TextInput, Pressable, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemedView style={styles.container}>
      {/* Map Area - Placeholder */}
      <View style={styles.mapContainer}>
        {/* This will be replaced with actual map library (react-native-maps) */}
        <View style={styles.mapPlaceholder}>
          <IconSymbol name="map" size={80} color="#10B981" />
          <ThemedText style={styles.mapPlaceholderText}>Map View</ThemedText>
          <ThemedText style={styles.mapSubtext}>Integrate react-native-maps here</ThemedText>
        </View>

        {/* Floating Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location or charger"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable style={styles.filterButton}>
            <IconSymbol name="slider.horizontal.3" size={20} color="#10B981" />
          </Pressable>
        </View>

        {/* Current Location Button */}
        <Pressable style={styles.currentLocationButton}>
          <IconSymbol name="location.fill" size={24} color="#FFFFFF" />
        </Pressable>

        {/* Bottom Sheet Handle */}
        <Pressable style={styles.bottomSheetHandle}>
          <View style={styles.handle} />
        </Pressable>
      </View>

      {/* Charger Markers Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <ThemedText style={styles.legendText}>Available</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <ThemedText style={styles.legendText}>Occupied</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <ThemedText style={styles.legendText}>Reserved</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#262626',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetHandle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7280',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
