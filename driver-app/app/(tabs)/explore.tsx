import { StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/search-bar';
import { MapCard } from '@/components/map-card';
import { FilterModal, FilterOptions } from '@/components/filter-modal';
import { useLocalSearchParams } from 'expo-router';

function ExploreScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const params = useLocalSearchParams();
  const hasAppliedFilter = useRef(false);

  useEffect(() => {
    // Check if we should apply a filter from navigation (only once)
    if (params.applyFilter === 'true' && params.amenity && !hasAppliedFilter.current) {
      const amenity = params.amenity as string;
      setActiveFilters({
        chargerSpeed: [],
        socketType: [],
        availability: 'All',
        amenities: [amenity],
      });
      console.log('Applied amenity filter:', amenity);
      hasAppliedFilter.current = true;
    }
  }, [params]);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  const handleFilterPress = () => {
    setFilterVisible(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    console.log('Applied filters:', filters);
    // TODO: Implement filter functionality
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Explore
      </ThemedText>
      <SearchBar onSearch={handleSearch} onFilterPress={handleFilterPress} />
      <MapCard style={styles.mapCard} />
      
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 20,
  },
  mapCard: {
    flex: 1,
  },
});

export default ExploreScreen;