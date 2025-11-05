import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/search-bar';
import { MapCard } from '@/components/map-card';
import { FilterModal, FilterOptions } from '@/components/filter-modal';

function ExploreScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);

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