// Consolidate imports at the top
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Image, Platform, Animated, Modal } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import TabBar from '@/app/components/TabBar';
import { Share } from 'react-native';

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
  const imageRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<{ [key: string]: boolean }>({});
  const [shareOptions, setShareOptions] = useState({
    productName: true,
    price: true,
    description: true,

    category: true,
    color: true,
  });

  // Add the missing handleScroll function
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

  // Calculate opacity for floating button
  const floatingButtonOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      console.log('Fetching product details for:', productId);
      const response = await fetch(`https://manavcreationbackend.onrender.com/api/v1/products/${productId}`);
      const data = await response.json();
      console.log('Product details response:', data);
      if (data.success) {
        console.log('Color data:', data.data.colors);
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add PhotoShareModal component inside the main component
  const PhotoShareModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showPhotoModal}
      onRequestClose={() => setShowPhotoModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Photos to Share</Text>
          <ScrollView>
            {product?.colors[selectedColor]?.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoItem}
                onPress={() => setSelectedPhotos(prev => ({...prev, [index]: !prev[index]}))}
              >
                <Image source={{ uri: image }} style={styles.photoPreview} />
                <View style={[styles.photoCheckbox, selectedPhotos[index] && styles.photoCheckboxSelected]}>
                  {selectedPhotos[index] && <Ionicons name="checkmark" size={18} color="#fff" />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowPhotoModal(false);
                setSelectedPhotos({});
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalShareButton]}
              onPress={handlePhotoShare}
            >
              <Text style={styles.modalShareButtonText}>Share Selected</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Add ShareOptionsModal component inside the main component
  const ShareOptionsModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showShareModal}
      onRequestClose={() => setShowShareModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Share Product Details</Text>
          
          {Object.entries(shareOptions).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.optionRow}
              onPress={() => setShareOptions(prev => ({...prev, [key]: !prev[key]}))}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, value && styles.checkboxSelected]}>
                    {value && <Ionicons name="checkmark" size={18} color="#fff" />}
                  </View>
                </View>
                <Text style={styles.optionText}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowShareModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalShareButton]}
              onPress={() => {
                setShowShareModal(false);
                handleShare();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalShareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Add handlePhotoShare function
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
    console.log('Starting text share process...');
    
    let shareContent = '';
    try {
      console.log('Building share content...');
      shareContent = 'Check out this product from Manav Creation!\n\n';
      
      const productLink = `https://manavcreation.com/product/${product._id}`;
      shareContent += `${productLink}\n\n`;
      
      if (shareOptions.productName) {
        console.log('Adding product name...');
        shareContent += `${product.name}\n`;
      }
      if (shareOptions.category) {
        console.log('Adding category...');
        shareContent += `Category: ${product.category.name}\n`;
      }
      if (shareOptions.price) {
        console.log('Adding price details...');
        shareContent += `Price: ₹${product.prices.regularPrice}\n`;
        if (product.prices.mrp > product.prices.regularPrice) {
          const discount = Math.round((1 - product.prices.regularPrice/product.prices.mrp) * 100);
          shareContent += `MRP: ₹${product.prices.mrp} (${discount}% OFF!)\n`;
        }
      }
      if (shareOptions.color) {
        console.log('Adding color info...');
        shareContent += `Color: ${product.colors[selectedColor]?.colorName}\n`;
      }
      if (shareOptions.description) {
        console.log('Adding description...');
        shareContent += `\nDescription:\n${product.description}\n`;
      }

      console.log('Sharing text content...');
      await Share.share({
        message: shareContent,
      });
      console.log('Text content shared successfully!');
    } catch (error) {
      console.error('Text sharing failed:', error);
    }
  };

  const shareImage = async () => {
    if (!product || !shareOptions.image) return;
    console.log('Starting image share process...');

    try {
      const imageUrl = product.colors[selectedColor]?.images[selectedImageIndex];
      if (!imageUrl) {
        console.log('No image URL available');
        return;
      }
      console.log('Image URL:', imageUrl);

      const localImagePath = `${FileSystem.cacheDirectory}share-image.jpg`;
      console.log('Downloading image to:', localImagePath);
      
      const { uri: downloadedUri } = await FileSystem.downloadAsync(
        imageUrl,
        localImagePath
      );
      console.log('Image downloaded successfully to:', downloadedUri);

      const isSharingAvailable = await Sharing.isAvailableAsync();
      console.log('Sharing availability:', isSharingAvailable);

      if (isSharingAvailable) {
        console.log('Sharing image...');
        await Sharing.shareAsync(downloadedUri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Product Image'
        });
        console.log('Image shared successfully!');
      }

      console.log('Cleaning up temporary files...');
      await FileSystem.deleteAsync(localImagePath, { idempotent: true });
      console.log('Temporary files cleaned up');
    } catch (error) {
      console.error('Image sharing failed:', error);
    }
  };

  const handleShare = async () => {
    console.log('Starting share process...');
    if (!product) {
      console.log('No product data available');
      return;
    }

    try {
      if (shareOptions.image) {
        console.log('Image sharing selected');
        await shareImage();
      }
      console.log('Starting text sharing');
      await shareDetails();
      console.log('Share process completed!');
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
            onPress={() => setSelectedImageIndex(index)}
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
              <Image 
                source={{ 
                  uri: color.images?.[0] || null,
                  defaultSource: require('../../../assets/images/favicon.png')
                }}
                style={styles.colorImage}
                resizeMode="cover"
                onError={() => console.log(`Using fallback image for color: ${color.colorName}`)}
              />
              <Text style={styles.colorName}>{color.colorName || 'Color'}</Text>
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
      
      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.mainImageContainer} ref={imageRef}>
          <Image 
            source={{ uri: product?.colors[selectedColor]?.images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {product.prices.mrp > product.prices.regularPrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round((1 - product.prices.regularPrice/product.prices.mrp) * 100)}% OFF
              </Text>
            </View>
          )}
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
      </Animated.ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => setShowPhotoModal(true)}
        >
          <Ionicons name="images-outline" size={22} color="#fff" />
          <Text style={styles.shareText}>Share Photos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: '#FF0000' }]}
          onPress={() => setShowShareModal(true)}
        >
          <Ionicons name="share-social-outline" size={22} color="#fff" />
          <Text style={styles.shareText}>Share Details</Text>
        </TouchableOpacity>
      </View>
      
      <PhotoShareModal />
      <ShareOptionsModal />
      <TabBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container styles
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
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF0000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Bottom bar styles
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    gap: 12,
    marginBottom: 64,
  },

  // Image styles
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
  thumbnailScroll: {
    backgroundColor: '#fff',
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

  // Product info styles
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
  categoryName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },

  // Price section styles
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
  mrpPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
  },

  // Stock status styles
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },

  // Color options styles
  colorOptions: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  colorOption: {
    width: 60,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    padding: 4,
  },
  colorImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginBottom: 4,
  },
  colorName: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#FF0000',
    transform: [{ scale: 1.05 }],
  },

  // Share button styles
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  modalShareButton: {
    backgroundColor: '#FF0000',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalShareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Photo modal styles
  photoItem: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  photoCheckbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  photoCheckboxSelected: {
    backgroundColor: '#4CAF50',
  },

  // Option row styles
  optionRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#FF0000',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
});