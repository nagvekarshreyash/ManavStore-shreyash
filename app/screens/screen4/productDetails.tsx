import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Image, Platform, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import TabBar from '@/app/components/TabBar';

interface Product {
  _id: string;
  name: string;
  description: string;
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
  isActive: boolean;
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
      const response = await fetch(`http://192.168.1.7:5000/api/v1/products/${productId}`);
      const data = await response.json();
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
            source={{ uri: product.colors[selectedColor]?.images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailScroll}
          contentContainerStyle={styles.thumbnailScrollContent}
        >
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity 
              key={item} 
              style={styles.thumbnailContainer}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../../../assets/images/favicon.png')}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product?.name || 'Product Name'}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star} 
                  name={star <= (product?.rating || 0) ? "star" : "star-outline"} 
                  size={18} 
                  color="#FFD700" 
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.rating}>
              {product?.rating || 0} 
              <Text style={styles.reviewCount}>({product?.reviews || 0} Reviews)</Text>
            </Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>
              {getCurrentPrice()}
              <Text style={styles.perUnit}>/piece</Text>
            </Text>
            <View style={styles.stockStatus}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>{product?.inStock ? 'In Stock' : 'Out of Stock'}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Colour</Text>
          <View style={styles.colorOptions}>
            {product?.colors?.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === index && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(index)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeOptions}>
            {product?.sizes?.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sizeOption,
                  selectedSize === index && styles.selectedSize,
                ]}
                onPress={() => setSelectedSize(index)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === index && styles.selectedSizeText
                ]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            High-quality pure cotton fabric, perfect for comfortable wear. Premium material
            that ensures durability and style. Our cotton is sourced from the finest mills
            to ensure superior quality and comfort.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
        </View>
        <TouchableOpacity 
          style={styles.shareButton}
          activeOpacity={0.7}
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={22} color="#fff" style={styles.shareIcon} />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
<TabBar/>

    </SafeAreaView>
  );
}

// Add to your styles
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