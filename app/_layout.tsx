import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomSplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      console.log('Fonts loaded, showing splash screen');
      const splashTimeout = setTimeout(() => {
        setShowCustomSplash(false);
        SplashScreen.hideAsync();
        console.log('Hiding splash screen');
      }, 5000);

      return () => clearTimeout(splashTimeout);
    }
  }, [loaded]);

  if (!loaded || showCustomSplash) {
    return <CustomSplashScreen onComplete={() => setShowCustomSplash(false)} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
