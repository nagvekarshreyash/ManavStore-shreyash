import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { name: 'index', icon: 'home-outline', label: 'Home' },
    { name: 'promo', icon: 'pricetag-outline', label: 'Promo' },
    { name: 'profile', icon: 'person-outline', label: 'Profile' }
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[
            styles.tabItem,
            pathname.includes(tab.name) && styles.activeTabItem
          ]}
          onPress={() => router.push(`/(tabs)/${tab.name}`)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={pathname.includes(tab.name) ? tab.icon.replace('-outline', '') : tab.icon}
            size={28}
            color={pathname.includes(tab.name) ? '#FF0000' : '#666'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeTabItem: {
    transform: [{ scale: 1.1 }],
  },
});