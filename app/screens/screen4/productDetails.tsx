import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Image, Platform, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import TabBar from '@/app/components/TabBar';

// Update the Product interface to match backend schema
interface Product {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  prices: {
    resellerPrice: number;
    specialPrice: number;
    mrp: number;
    regularPrice: number;
  };
  colors: Array<{
    _id: string;
    colorName: string;
    images: string[];
  }>;
  pdfLink: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      console.log('Fetching product details for:', productId);
      const response = await fetch(`http://192.168.1.7:5000/api/v1/products/${productId}`);
      const data = await response.json();
      console.log('Product details response:', data);
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton title="Product Details" />
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton title="Product Details" />
        <View style={styles.loadingContainer}>
          <Text>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getCurrentPrice = () => {
    if (!product) return '₹0';
    return `₹${product.prices.regularPrice}`;
  };

  // Update the thumbnail section to use actual product images
  const renderThumbnails = () => {
    if (!product || !product.colors[selectedColor]) return null;
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailScroll}
        contentContainerStyle={styles.thumbnailScrollContent}
      >
        {product.colors[selectedColor].images.map((image, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.thumbnailContainer}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: image }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Update the color options section
  const renderColorOptions = () => {
    if (!product) return null;

    return (
      <>
        <Text style={styles.sectionTitle}>Colour</Text>
        <View style={styles.colorOptions}>
          {product.colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorOption,
                selectedColor === index && styles.selectedColor,
              ]}
              onPress={() => setSelectedColor(index)}
            >
              <Text style={styles.colorName}>{color.colorName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header showBackButton title="Product Details" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainImageContainer}>
          <Image 
            source={{ uri: product?.colors[selectedColor]?.images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {renderThumbnails()}

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product?.name}</Text>
          <Text style={styles.categoryName}>{product?.category?.name}</Text>

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.price}>{getCurrentPrice()}</Text>
              {product?.prices.mrp > product?.prices.regularPrice && (
                <Text style={styles.mrpPrice}>MRP: ₹{product?.prices.mrp}</Text>
              )}
            </View>
            <View style={styles.stockStatus}>
              <View style={[styles.stockDot, { backgroundColor: product?.isActive ? '#4CAF50' : '#FF0000' }]} />
              <Text style={[styles.stockText, { color: product?.isActive ? '#4CAF50' : '#FF0000' }]}>
                {product?.isActive ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {renderColorOptions()}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product?.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.shareButton}
          activeOpacity={0.7}
          onPress={() => {
            // Implement share functionality
          }}
        >
          <Ionicons name="share-social-outline" size={22} color="#fff" style={styles.shareIcon} />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
      <TabBar/>
    </SafeAreaView>
  );
}

// Add these new styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android'? StatusBar.currentHeight : 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  mainImageContainer: {
    height: 350,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  productInfo: {
    padding: 20,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewCount: {
    color: '#666',
    fontWeight: '400',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF0000',
  },
  perUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    marginLeft: 4,
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  stockText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  thumbnailScroll: {
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  colorOptions: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#FF0000',
    transform: [{ scale: 1.1 }],
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
    marginBottom: 12,
  },
  selectedSize: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  sizeText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedSizeText: {
    color: '#fff',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  priceContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginLeft: 16,
    marginBottom: 60,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginLeft: 16,
    marginBottom: 60,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});