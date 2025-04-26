import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';

interface PhotoShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  product: Product | null;
  selectedColor: number;
  selectedPhotos: { [key: string]: boolean };
  setSelectedPhotos: (photos: { [key: string]: boolean }) => void;
}

const PhotoShareModal: React.FC<PhotoShareModalProps> = ({
  visible,
  onClose,
  onShare,
  product,
  selectedColor,
  selectedPhotos,
  setSelectedPhotos,
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
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalShareButton]}
              onPress={onShare}
            >
              <Text style={styles.modalShareButtonText}>Share Selected</Text>
            </TouchableOpacity>
          </View>
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
});

export default PhotoShareModal;