import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, StyleSheet } from 'react-native';
import { Product } from '../types';

interface ColorSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
  selectedColor: number;
  setSelectedColor: (index: number) => void;
}

const ColorSelectionModal: React.FC<ColorSelectionModalProps> = ({
  visible,
  onClose,
  product,
  selectedColor,
  setSelectedColor,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Color</Text>
          <ScrollView style={styles.colorList}>
            {product.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  selectedColor === index && styles.selectedColor,
                ]}
                onPress={() => {
                  setSelectedColor(index);
                  onClose();
                }}
              >
                <Image 
                  source={{ 
                    uri: color.images?.[0] || null,
                    defaultSource: require('../../../../assets/images/favicon.png')
                  }}
                  style={styles.colorImage}
                  resizeMode="cover"
                />
                <Text style={styles.colorName}>{color.colorName || 'Color'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  colorList: {
    maxHeight: 400,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedColor: {
    backgroundColor: '#e0e0e0',
  },
  colorImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  colorName: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default ColorSelectionModal;