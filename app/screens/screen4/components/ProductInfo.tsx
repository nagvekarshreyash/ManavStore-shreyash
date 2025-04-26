import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Product } from '../types';
import ColorSelectionModal from './ColorSelectionModal';

interface ProductInfoProps {
  product: Product;
  selectedColor: number;
  setSelectedColor: (index: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedColor,
  setSelectedColor,
}) => {
  const [showColorModal, setShowColorModal] = useState(false);

  const getCurrentPrice = () => {
    if (!product) return '₹0';
    return `₹${product.prices.regularPrice}`;
  };

  const renderColorOptions = () => {
    if (!product) return null;
  
    const visibleColors = product.colors.slice(0, 4);
    const hasMoreColors = product.colors.length > 4;
  
    return (
      <>
        <Text style={styles.sectionTitle}>Colour</Text>
        <View style={styles.colorOptions}>
          {visibleColors.map((color, index) => (
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
                  defaultSource: require('../../../../assets/images/favicon.png')
                }}
                style={styles.colorImage}
                resizeMode="cover"
                onError={() => console.log(`Using fallback image for color: ${color.colorName}`)}
              />
              <Text style={styles.colorName}>{color.colorName || 'Color'}</Text>
            </TouchableOpacity>
          ))}
          {hasMoreColors && (
            <TouchableOpacity
              style={[styles.colorOption, styles.viewMoreButton]}
              onPress={() => setShowColorModal(true)}
            >
              <Text style={styles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          )}
        </View>

        <ColorSelectionModal
          visible={showColorModal}
          onClose={() => setShowColorModal(false)}
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </>
    );
  };

  return (
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
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
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
  viewMoreButton: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default ProductInfo;