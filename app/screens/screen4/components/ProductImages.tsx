import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';

interface ProductImagesProps {
  product: Product;
  selectedColor: number;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  product,
  selectedColor,
  selectedImageIndex,
  setSelectedImageIndex,
}) => {
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

  return (
    <>
      <View style={styles.mainImageContainer}>
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
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default ProductImages;