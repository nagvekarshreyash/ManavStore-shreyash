import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type SearchBarProps = {
  placeholder?: string;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
};

export default function SearchBar({ 
  placeholder = 'Search products...', 
  onSearchPress, 
  onFilterPress 
}: SearchBarProps) {
  return (
    <View style={styles.searchWrapper}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TouchableOpacity 
          style={styles.searchBar} 
          activeOpacity={0.7}
          onPress={onSearchPress}
        >
          <Text style={styles.searchText}>{placeholder}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton} 
          activeOpacity={0.7}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchText: {
    color: '#999',
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
});