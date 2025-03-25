import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Header({ 
  showBackButton = false, 
  title = 'MANAV STORE',
  onMenuPress,
  onNotificationPress 
}: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={showBackButton ? handleBackPress : onMenuPress}
        activeOpacity={0.7}
      >
        {showBackButton ? (
          <Ionicons 
            name="arrow-back" 
            size={SCREEN_WIDTH < 375 ? 24 : 28} 
            color="#FF0000" 
          />
        ) : (
          <Ionicons 
            name="menu-outline" 
            size={SCREEN_WIDTH < 375 ? 24 : 28} 
            color="#FF0000" 
          />
        )}
      </TouchableOpacity>
      <Text 
        style={styles.storeName}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="notifications-outline" 
          size={SCREEN_WIDTH < 375 ? 22 : 24} 
          color="#FF0000" 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH < 375 ? 12 : 16,
    paddingVertical: SCREEN_WIDTH < 375 ? 10 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuButton: {
    padding: SCREEN_WIDTH < 375 ? 6 : 8,
    borderRadius: 8,
  },
  storeName: {
    fontSize: SCREEN_WIDTH < 375 ? 18 : 22,
    fontWeight: '700',
    color: '#FF0000',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
});