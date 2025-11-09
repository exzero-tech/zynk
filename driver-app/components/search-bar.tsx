import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilterPress?: () => void;
  style?: any;
}

export function SearchBar({ placeholder = "Search charging stations...", onSearch, onFilterPress, style }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSubmit = () => {
    handleSearch();
  };

  const handleFilter = () => {
    if (onFilterPress) {
      onFilterPress();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor }, style]}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor="#888888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: tintColor }]}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <MaterialIcons name="search" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: '#888888' }]}
        onPress={handleFilter}
        activeOpacity={0.8}
      >
        <MaterialIcons name="filter-list" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50, // 100% rounded corners (pill shape)
    paddingHorizontal: 4,
    paddingVertical: 5,
    marginRight: 4,
    maxWidth: 295,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontFamily: 'Inter_24pt-Regular',
  },
  searchButton: {
    width: 56,
    height: 56,
    borderRadius: 28, // Circular button
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28, // Circular button
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
});