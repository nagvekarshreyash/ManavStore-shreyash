import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomSplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      const splashTimeout = setTimeout(() => {
        setShowCustomSplash(false);
        SplashScreen.hideAsync();
      }, 5000);

      return () => clearTimeout(splashTimeout);
    }
  }, [loaded]);

  if (!loaded || showCustomSplash) {
    return <CustomSplashScreen onComplete={() => setShowCustomSplash(false)} />;
  }

  if (!isLoggedIn) {
    if (authScreen === 'login') {
      return (
        <LoginScreen
          onLogin={() => setIsLoggedIn(true)}
          onSignupPress={() => setAuthScreen('signup')}
        />
      );
    }
    return (
      <SignupScreen
        onSignup={() => setIsLoggedIn(true)}
        onLoginPress={() => setAuthScreen('login')}
      />
    );
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
