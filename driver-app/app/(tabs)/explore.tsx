import { StyleSheet, View, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { router } from 'expo-router';

interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  status: 'Available' | 'Occupied' | 'Offline';
}

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    connectorType: 'All',
    powerLevel: 'All',
    maxPrice: 500,
    amenities: [] as string[],
  });
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  // Mock data - will be replaced with real API data
  const nearbyChargers = [
    {
      id: 1,
      name: 'Mall Parking Charger',
      distance: '0.5 km',
      price: '150 LKR/hr',
      type: 'Level 2',
      connector: 'Type 2',
      power: '7.2 kW',
      status: 'Available',
      rating: 4.5,
      amenities: ['WiFi', 'Cafe', 'Parking'],
      lat: 6.9271,
      lng: 79.8612,
    },
    {
      id: 2,
      name: 'City Center Station',
      distance: '1.2 km',
      price: '200 LKR/hr',
      type: 'DC Fast',
      connector: 'CCS2',
      power: '50 kW',
      status: 'Available',
      rating: 4.8,
      amenities: ['Restaurant', 'Restroom'],
      lat: 6.9319,
      lng: 79.8478,
    },
    {
      id: 3,
      name: 'Office Complex',
      distance: '2.1 km',
      price: '120 LKR/hr',
      type: 'Level 2',
      connector: 'Type 2',
      power: '7.2 kW',
      status: 'Occupied',
      rating: 4.3,
      amenities: ['WiFi', 'Lounge'],
      lat: 6.9147,
      lng: 79.8736,
    },
  ];

  const mapMarkers: MapMarker[] = nearbyChargers.map((c) => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    status: c.status as 'Available' | 'Occupied' | 'Offline',
  }));

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#10B981';
      case 'Occupied':
        return '#F59E0B';
      case 'Offline':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const sortedChargers = [...nearbyChargers].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'price':
        return parseInt(a.price) - parseInt(b.price);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Find Charger</ThemedText>
        <Pressable style={styles.locationButton}>
          <IconSymbol name="location.fill" size={20} color="#10B981" />
          <ThemedText style={styles.locationText}>Colombo</ThemedText>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location or charger"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <IconSymbol name="slider.horizontal.3" size={20} color="#10B981" />
        </Pressable>
      </View>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          {/* Simulated map markers */}
          <View style={styles.mapContent}>
            <IconSymbol name="map" size={48} color="#10B981" style={styles.mapIcon} />
            <ThemedText style={styles.mapText}>Interactive Map</ThemedText>
            <ThemedText style={styles.mapSubtext}>
              Showing {nearbyChargers.length} chargers nearby
            </ThemedText>

            {/* Marker Legend */}
            <View style={styles.markerLegend}>
              {mapMarkers.map((marker) => (
                <View
                  key={marker.id}
                  style={[styles.marker, { backgroundColor: getMarkerColor(marker.status) }]}
                >
                  <IconSymbol name="bolt.fill" size={12} color="#FFFFFF" />
                </View>
              ))}
            </View>
          </View>

          {/* Current Location Button */}
          <Pressable style={styles.currentLocationButton}>
            <IconSymbol name="location.fill" size={24} color="#FFFFFF" />
          </Pressable>

          {/* Map Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <ThemedText style={styles.legendText}>Available</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <ThemedText style={styles.legendText}>Occupied</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <ThemedText style={styles.legendText}>Offline</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            style={[styles.sortButton, sortBy === 'distance' && styles.sortButtonActive]}
            onPress={() => setSortBy('distance')}
          >
            <IconSymbol
              name="arrow.up.arrow.down"
              size={16}
              color={sortBy === 'distance' ? '#10B981' : '#6B7280'}
            />
            <ThemedText
              style={[styles.sortText, sortBy === 'distance' && styles.sortTextActive]}
            >
              Distance
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
            onPress={() => setSortBy('price')}
          >
            <IconSymbol
              name="dollarsign.circle"
              size={16}
              color={sortBy === 'price' ? '#10B981' : '#6B7280'}
            />
            <ThemedText style={[styles.sortText, sortBy === 'price' && styles.sortTextActive]}>
              Price
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
            onPress={() => setSortBy('rating')}
          >
            <IconSymbol
              name="star.fill"
              size={16}
              color={sortBy === 'rating' ? '#10B981' : '#6B7280'}
            />
            <ThemedText style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>
              Rating
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      {/* Charger List */}
      <ScrollView style={styles.chargerList} showsVerticalScrollIndicator={false}>
        {sortedChargers.map((charger) => (
          <Pressable key={charger.id} style={styles.chargerCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleSection}>
                <ThemedText style={styles.chargerName}>{charger.name}</ThemedText>
                <View style={styles.distanceRow}>
                  <IconSymbol name="location" size={14} color="#6B7280" />
                  <ThemedText style={styles.distance}>{charger.distance}</ThemedText>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      charger.status === 'Available' ? '#10B98120' : '#EF444420',
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        charger.status === 'Available' ? '#10B981' : '#EF4444',
                    },
                  ]}
                />
                <ThemedText style={styles.statusText}>{charger.status}</ThemedText>
              </View>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailItem}>
                <IconSymbol name="bolt.fill" size={16} color="#10B981" />
                <ThemedText style={styles.detailText}>{charger.type}</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <IconSymbol name="cable.connector" size={16} color="#10B981" />
                <ThemedText style={styles.detailText}>{charger.connector}</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <IconSymbol name="gauge" size={16} color="#10B981" />
                <ThemedText style={styles.detailText}>{charger.power}</ThemedText>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.priceRating}>
                <ThemedText style={styles.price}>{charger.price}</ThemedText>
                <View style={styles.ratingContainer}>
                  <IconSymbol name="star.fill" size={14} color="#F59E0B" />
                  <ThemedText style={styles.rating}>{charger.rating}</ThemedText>
                </View>
              </View>
              <Pressable style={styles.viewButton} onPress={() => router.push('/charger-details')}>
                <ThemedText style={styles.viewButtonText}>View Details</ThemedText>
                <IconSymbol name="chevron.right" size={16} color="#10B981" />
              </Pressable>
            </View>
          </Pressable>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Filters</ThemedText>
              <Pressable onPress={() => setShowFilters(false)}>
                <IconSymbol name="xmark" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView style={styles.filterContent}>
              <View style={styles.filterSection}>
                <ThemedText style={styles.filterLabel}>Connector Type</ThemedText>
                <View style={styles.filterOptions}>
                  {['All', 'Type 2', 'CCS2', 'CHAdeMO'].map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.filterOption,
                        filters.connectorType === type && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilters({ ...filters, connectorType: type })}
                    >
                      <ThemedText
                        style={[
                          styles.filterOptionText,
                          filters.connectorType === type && styles.filterOptionTextActive,
                        ]}
                      >
                        {type}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <ThemedText style={styles.filterLabel}>Power Level</ThemedText>
                <View style={styles.filterOptions}>
                  {['All', 'Level 2', 'DC Fast', 'Ultra Fast'].map((level) => (
                    <Pressable
                      key={level}
                      style={[
                        styles.filterOption,
                        filters.powerLevel === level && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilters({ ...filters, powerLevel: level })}
                    >
                      <ThemedText
                        style={[
                          styles.filterOptionText,
                          filters.powerLevel === level && styles.filterOptionTextActive,
                        ]}
                      >
                        {level}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <ThemedText style={styles.filterLabel}>
                  Max Price: {filters.maxPrice} LKR/hr
                </ThemedText>
                <View style={styles.priceRangeDisplay}>
                  <ThemedText style={styles.priceRangeValue}>0</ThemedText>
                  <View style={styles.priceBar}>
                    <View
                      style={[
                        styles.priceBarFill,
                        { width: `${(filters.maxPrice / 500) * 100}%` },
                      ]}
                    />
                  </View>
                  <ThemedText style={styles.priceRangeValue}>500</ThemedText>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.resetButton}
                onPress={() =>
                  setFilters({
                    connectorType: 'All',
                    powerLevel: 'All',
                    maxPrice: 500,
                    amenities: [],
                  })
                }
              >
                <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={() => setShowFilters(false)}>
                <ThemedText style={styles.applyButtonText}>Apply Filters</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
  },
  locationText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
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
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  mapContainer: {
    height: 240,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    position: 'relative',
  },
  mapContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIcon: {
    marginBottom: 8,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  markerLegend: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#0F0F0F',
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  sortContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#10B98120',
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  sortTextActive: {
    color: '#10B981',
  },
  chargerList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chargerCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleSection: {
    flex: 1,
  },
  chargerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#262626',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#10B98120',
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  bottomSpacer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  filterOptionActive: {
    backgroundColor: '#10B98120',
    borderColor: '#10B981',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  filterOptionTextActive: {
    color: '#10B981',
  },
  priceRangeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceRangeValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#262626',
    borderRadius: 3,
    overflow: 'hidden',
  },
  priceBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});