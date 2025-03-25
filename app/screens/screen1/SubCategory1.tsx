import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import TabBar from '../../components/TabBar';

interface SubCategory {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const apparelsSubCategories: SubCategory[] = [
  { id: 1, name: 'T-Shirts', icon: 'shirt-outline' },
  { id: 2, name: 'Shirts', icon: 'shirt-outline' },
  { id: 3, name: 'Jackets', icon: 'jacket-outline' },
  { id: 4, name: 'Caps', icon: 'baseball-outline' },
  { id: 5, name: 'Hoodies', icon: 'shirt-outline' },
  { id: 6, name: 'Polo T-Shirts', icon: 'shirt-outline' },
];

const trophiesSubCategories = [
  { id: 1, name: 'Crystal', icon: 'trophy-outline' },
  { id: 2, name: 'Metal', icon: 'trophy-outline' },
  { id: 3, name: 'Glass', icon: 'trophy-outline' },
  { id: 4, name: 'Acrylic', icon: 'trophy-outline' },
];

const corporateGiftsSubCategories = [
  { id: 1, name: 'Pens', icon: 'pencil-outline' },
  { id: 2, name: 'Bags', icon: 'bag-outline' },
  { id: 3, name: 'Drinkware', icon: 'water-outline' },
  { id: 4, name: 'Desk Items', icon: 'desktop-outline' },
];

const personalGiftsSubCategories = [
  { id: 1, name: 'Photo Frames', icon: 'image-outline' },
  { id: 2, name: 'Custom Mugs', icon: 'cafe-outline' },
  { id: 3, name: 'Keychains', icon: 'key-outline' },
  { id: 4, name: 'Phone Cases', icon: 'phone-portrait-outline' },
];

interface RouteParams {
  category: string;
  categoryId: string;
}

export default function SubCategory1() {
  const router = useRouter();
  const { category, categoryId } = useLocalSearchParams<RouteParams>();

  const getSubCategories = (): SubCategory[] => {
    switch (category) {
      case 'apparels':
        return apparelsSubCategories;
      case 'trophies':
        return trophiesSubCategories;
      case 'corporate-gifts':
        return corporateGiftsSubCategories;
      case 'personalised-gifts':
        return personalGiftsSubCategories;
      default:
        return [];
    }
  };

  const handleSubCategoryPress = (subCategoryId: number): void => {
    router.push({
      pathname: '/screens/screen2/material',
      params: { 
        category, 
        categoryId, 
        subCategoryId: subCategoryId.toString()
      }
    });
  };

  const formatCategoryTitle = (text: string): string => {
    return text.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header showBackButton />
      <SearchBar placeholder={`Search in ${category}...`} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>{formatCategoryTitle(category || '')}</Text>
        <View style={styles.categoriesGrid}>
          {getSubCategories().map((subCategory) => (
            <TouchableOpacity 
              key={subCategory.id} 
              style={styles.categoryCard}
              activeOpacity={0.7}
              onPress={() => handleSubCategoryPress(subCategory.id)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={subCategory.icon} size={32} color="#FF0000" />
              </View>
              <Text style={styles.categoryName}>{subCategory.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButton: {
    padding: 8,
  },
  storeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF0000',
    letterSpacing: 1,
  },
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
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 20,
    marginHorizontal: 16,
    color: '#222',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  categoryCard: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: '2.5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
});