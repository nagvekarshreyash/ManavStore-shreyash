import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Image, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (SCREEN_WIDTH - (32 + CARD_MARGIN * 2)) / 2;

// Add more products for better presentation
// Export the products array
export const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    materialName: 'Pure Cotton',
    prices: {
      retail: '₹899',
      wholesale: '₹699',
      distributor: '₹599'
    },
    rating: 4.8,
    reviews: 245,
    images: {
      white: require('../../../assets/images/favicon.png'),
      black: require('../../../assets/images/adaptive-icon.png'),
      grey: require('../../../assets/images/favicon.png')
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#FFFFFF', '#000000', '#808080'],
    colorNames: ['white', 'black', 'grey'],
    inStock: true,
    discount: '20%',
    isNew: true,
  },
  {
    id: 2,
    name: 'Casual Black Polo',
    materialName: 'Cotton Blend',
    prices: {
      retail: '₹1,299',
      wholesale: '₹999',
      distributor: '₹899'
    },
    rating: 4.6,
    reviews: 189,
    images: {
      black: require('../../../assets/images/favicon.png'),
      navy: require('../../../assets/images/favicon.png'),
      grey: require('../../../assets/images/favicon.png')
    },
    sizes: ['M', 'L', 'XL'],
    colors: ['#000000', '#000080', '#808080'],
    colorNames: ['black', 'navy', 'grey'],
    inStock: true,
    discount: '15%',
  },
];



interface Product {
  _id: string;
  name: string;
  category: string;
  prices: {
    resellerPrice: number;
    specialPrice: number;
    mrp: number;
    regularPrice: number;
  };
  colors: Array<{
    colorName: string;
    images: string[];
  }>;
  description: string;
  isActive: boolean;
}

export default function Products() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add handleProductPress function
  const handleProductPress = (productId: string) => {
    router.push({
      pathname: '/screens/screen4/productDetails',
      params: { productId }
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products for category:', categoryId);
      const response = await fetch(`http://192.168.1.7:5000/api/v1/products/category/${categoryId}`);
      const data = await response.json();
      console.log('Products response:', data);
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add loading state UI
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton title="Products" />
        <View style={styles.loadingContainer}>
          <Text>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Add empty state UI
  if (!products || products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton title="Products" />
        <View style={styles.loadingContainer}>
          <Text>No products found for this category</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header showBackButton title="Products" />
      
      <View style={styles.mainContent}>
        <SearchBar 
          placeholder="Search products..."
          style={styles.searchBarContainer}
          onSearchPress={() => console.log('Search')}
          onFilterPress={() => console.log('Filter')}
        />

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
        >
          {products.map((product) => (
            <TouchableOpacity
              key={product._id}
              style={styles.productCard}
              onPress={() => handleProductPress(product._id)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: product.colors[0].images[0] }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₹{product.prices.regularPrice}</Text>
                  {product.prices.mrp > product.prices.regularPrice && (
                    <Text style={styles.originalPrice}>₹{product.prices.mrp}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Add to styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
  },
  searchBarContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  productsGrid: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (SCREEN_WIDTH - 24) / 2, // Adjusted width for 2 columns
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  materialName: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  starIcon: {
    marginRight: 2,
  },
  rating: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    letterSpacing: 0.5,
  },
  originalPrice: {
    fontSize: 13,
    color: '#adb5bd',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

// Remove this line
// export default products;

// Add SearchBar props interface
interface SearchBarProps {
  placeholder: string;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  style?: any; // or use proper StyleProp<ViewStyle> if you want to be more specific
}
