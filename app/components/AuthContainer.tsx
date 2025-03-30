import React, { useState } from 'react';
import { View } from 'react-native';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

interface AuthContainerProps {
  onAuthenticated: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthenticated }) => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup'>('login');

  const handleSignupPress = () => {
    setCurrentScreen('signup');
  };

  const handleLoginPress = () => {
    setCurrentScreen('login');
  };

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={onAuthenticated}
        onSignupPress={handleSignupPress}
      />
    );
  }

  return (
    <SignupScreen
      onSignup={onAuthenticated}
      onLoginPress={handleLoginPress}
    />
  );
};

export default AuthContainer;