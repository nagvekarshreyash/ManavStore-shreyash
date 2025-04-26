import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShareButtonsProps {
  onPhotoShare: () => void;
  onDetailsShare: () => void;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  onPhotoShare,
  onDetailsShare,
}) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={[styles.shareButton, { backgroundColor: '#4CAF50' }]}
        onPress={onPhotoShare}
      >
        <Ionicons name="images-outline" size={22} color="#fff" />
        <Text style={styles.shareText}>Share Photos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.shareButton, { backgroundColor: '#FF0000' }]}
        onPress={onDetailsShare}
      >
        <Ionicons name="share-social-outline" size={22} color="#fff" />
        <Text style={styles.shareText}>Share Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    gap: 12,
    marginBottom: 64,
  },
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
});

export default ShareButtons;