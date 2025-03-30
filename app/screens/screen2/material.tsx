import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import TabBar from '../../components/TabBar';
import { useState, useEffect } from 'react';

const materials = [
  { 
    id: 1, 
    name: 'Pure Cotton', 
    image: require('../../../assets/images/favicon.png'),
    description: 'High-quality pure cotton fabric, perfect for comfortable wear',
    subtitle: 'Premium Quality Material',
    price: '₹500/meter',
    rating: 4.8,
    reviews: 128,
    inStock: true
  },
  { 
    id: 2, 
    name: 'Cotton Blend',
    image: require('../../../assets/images/favicon.png'),
    description: 'Premium cotton blend offering durability and comfort',
    subtitle: 'Durable & Comfortable',
    price: '₹400/meter',
    rating: 4.5,
    reviews: 96,
    inStock: true
  },
  // Update other materials with complete data
  { 
    id: 3, 
    name: 'Egyptian Cotton', 
    image: require('../../../assets/images/favicon.png'),
    description: 'Luxurious Egyptian cotton for premium comfort',
    subtitle: 'Luxury Material',
    price: '₹600/meter',
    rating: 4.9,
    reviews: 75,
    inStock: false
  },
  { id: 4, name: 'Organic Cotton', icon: 'leaf-outline' },
  { id: 5, name: 'Premium Cotton', icon: 'leaf-outline' },
  { id: 6, name: 'Sustainable Cotton', icon: 'leaf-outline' },
];

interface Category {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export default function Material() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://manavcreationbackend.onrender.com/api/v1/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaterialPress = (categoryId: string) => {
    router.push({
      pathname: '/screens/screen3/products',
      params: { categoryId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header showBackButton title="Materials" />
      <SearchBar 
        placeholder="Search materials..."
        onSearchPress={() => console.log('Search pressed')}
        onFilterPress={() => console.log('Filter pressed')}
      />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.cardsContainer}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category._id} 
              style={styles.materialCard}
              activeOpacity={0.9}
              onPress={() => handleMaterialPress(category._id)}
            >
              <View style={styles.cardContent}>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: category.imageUrl }}
                    style={styles.materialImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.materialName}>{category.name}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {category.description}
                  </Text>
                </View>
              </View>
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
    marginTop: Platform.OS === 'android'? StatusBar.currentHeight : 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  cardsContainer: {
    padding: 16,
  },
  materialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  materialImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  materialName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF0000',
    marginBottom: 4,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
});