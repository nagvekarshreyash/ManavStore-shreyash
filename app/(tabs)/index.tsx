import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

interface Category {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const categories: Category[] = [
  { id: 1, name: 'Apparels', icon: 'shirt-outline', route: 'apparels' },
  { id: 2, name: 'Trophies', icon: 'trophy-outline', route: 'trophies' },
  { id: 3, name: 'Corporate Gifts', icon: 'gift-outline', route: 'corporate-gifts' },
  { id: 4, name: 'Personalised Gifts', icon: 'heart-outline', route: 'personalised-gifts' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = SCREEN_WIDTH < 375 ? 8 : 10;
const CARD_WIDTH = (SCREEN_WIDTH - (CARD_MARGIN * 6)) / 2;

export default function Index() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: number, route: string) => {
    router.push({
      pathname: '/screens/screen1/SubCategory1',
      params: { 
        category: route,
        categoryId: categoryId.toString()
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />
      <SearchBar 
        placeholder="Search products..."
        onSearchPress={() => console.log('Search pressed')}
        onFilterPress={() => console.log('Filter pressed')}
      />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[styles.categoryCard, { width: CARD_WIDTH }]}
              activeOpacity={0.7}
              onPress={() => handleCategoryPress(category.id, category.route)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={category.icon} size={SCREEN_WIDTH < 375 ? 24 : 32} color="#FF0000" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android'? StatusBar.currentHeight : 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  title: {
    fontSize: SCREEN_WIDTH < 375 ? 20 : 24,
    fontWeight: '700',
    marginVertical: SCREEN_WIDTH < 375 ? 16 : 20,
    marginHorizontal: 16,
    color: '#222',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: CARD_MARGIN,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: SCREEN_WIDTH < 375 ? 16 : 20,
    margin: CARD_MARGIN,
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
    padding: SCREEN_WIDTH < 375 ? 12 : 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: SCREEN_WIDTH < 375 ? 14 : 16,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
});