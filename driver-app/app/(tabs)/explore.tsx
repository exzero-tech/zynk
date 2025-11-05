import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/search-bar';
import { MapCard } from '@/components/map-card';

function ExploreScreen() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Explore
      </ThemedText>
      <SearchBar onSearch={handleSearch} />
      <MapCard style={styles.mapCard} />
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