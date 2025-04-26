import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Platform, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Share } from 'react-native';
import Header from '../../components/Header';
import TabBar from '@/app/components/TabBar';
// Update imports
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import ShareButtons from './components/ShareButtons';
import PhotoShareModal from './components/PhotoShareModal';
import ShareOptionsModal from './components/ShareOptionsModal';
import { Product, ShareOptions } from './types';

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const imageRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<{ [key: string]: boolean }>({});
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    productName: true,
    price: true,
    description: true,
    category: true,
    color: true,
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        setIsFloatingButtonVisible(
          currentScrollY < lastScrollY.current || 
          currentScrollY < 50 ||
          currentScrollY + event.nativeEvent.layoutMeasurement.height >= 
          event.nativeEvent.contentSize.height - 20
        );
        lastScrollY.current = currentScrollY;
      }
    }
  );

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/v1/products/${productId}`);
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

  const handlePhotoShare = async () => {
    try {
      const selectedImages = Object.entries(selectedPhotos)
        .filter(([_, isSelected]) => isSelected)
        .map(([index]) => product?.colors[selectedColor]?.images[Number(index)]);

      for (const imageUrl of selectedImages) {
        const localImagePath = `${FileSystem.cacheDirectory}share-image-${Date.now()}.jpg`;
        const { uri } = await FileSystem.downloadAsync(imageUrl, localImagePath);
        await Sharing.shareAsync(uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Product Image'
        });
        await FileSystem.deleteAsync(localImagePath, { idempotent: true });
      }
      setShowPhotoModal(false);
      setSelectedPhotos({});
    } catch (error) {
      console.error('Photo sharing failed:', error);
    }
  };

  const shareDetails = async () => {
    if (!product) return;
    
    let shareContent = '';
    try {
      shareContent = 'Check out this product from Manav Creation!\n\n';
      
      const productLink = `https://manavcreation.com/product/${product._id}`;
      shareContent += `${productLink}\n\n`;
      
      if (shareOptions.productName) {
        shareContent += `${product.name}\n`;
      }
      if (shareOptions.category) {
        shareContent += `Category: ${product.category.name}\n`;
      }
      if (shareOptions.price) {
        shareContent += `Price: ₹${product.prices.regularPrice}\n`;
        if (product.prices.mrp > product.prices.regularPrice) {
          const discount = Math.round((1 - product.prices.regularPrice/product.prices.mrp) * 100);
          shareContent += `MRP: ₹${product.prices.mrp} (${discount}% OFF!)\n`;
        }
      }
      if (shareOptions.color) {
        shareContent += `Color: ${product.colors[selectedColor]?.colorName}\n`;
      }
      if (shareOptions.description) {
        shareContent += `\nDescription:\n${product.description}\n`;
      }

      await Share.share({
        message: shareContent,
      });
    } catch (error) {
      console.error('Text sharing failed:', error);
    }
  };

  const shareImage = async () => {
    if (!product || !shareOptions.image) return;

    try {
      const imageUrl = product.colors[selectedColor]?.images[selectedImageIndex];
      if (!imageUrl) return;

      const localImagePath = `${FileSystem.cacheDirectory}share-image.jpg`;
      const { uri: downloadedUri } = await FileSystem.downloadAsync(
        imageUrl,
        localImagePath
      );

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(downloadedUri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Product Image'
        });
      }

      await FileSystem.deleteAsync(localImagePath, { idempotent: true });
    } catch (error) {
      console.error('Image sharing failed:', error);
    }
  };

  const handleShare = async () => {
    if (!product) return;

    try {
      if (shareOptions.image) {
        await shareImage();
      }
      await shareDetails();
    } catch (error) {
      console.error('Share process failed:', error);
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
      
      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <ProductImages 
          product={product}
          selectedColor={selectedColor}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
        
        <ProductInfo
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </Animated.ScrollView>

      <ShareButtons
        onPhotoShare={() => setShowPhotoModal(true)}
        onDetailsShare={() => setShowShareModal(true)}
      />
      
      <PhotoShareModal
        visible={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false);
          setSelectedPhotos({});
        }}
        onShare={handlePhotoShare}
        product={product}
        selectedColor={selectedColor}
        selectedPhotos={selectedPhotos}
        setSelectedPhotos={setSelectedPhotos}
      />
      
      <ShareOptionsModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={() => {
          setShowShareModal(false);
          handleShare();
        }}
        shareOptions={shareOptions}
        setShareOptions={setShareOptions}
      />
      
      <TabBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  }
});