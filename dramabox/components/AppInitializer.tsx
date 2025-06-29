import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { storageService } from '../services/StorageService';
import { notificationService } from '../services/NotificationService';
import { localizationService } from '../services/LocalizationService';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize all services
      await Promise.all([
        initializeStorage(),
        initializeNotifications(),
        initializeLocalization(),
      ]);

      setIsReady(true);
    } catch (err) {
      console.error('App initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Initialization failed');
    } finally {
      // Hide the splash screen
      await SplashScreen.hideAsync();
    }
  };

  const initializeStorage = async () => {
    try {
      // Load user settings
      const settings = await storageService.getSettings();
      if (settings) {
        console.log('Settings loaded:', settings);
      }

      // Load user profile
      const profile = await storageService.getUserProfile();
      if (profile) {
        console.log('User profile loaded:', profile.username);
      }
    } catch (error) {
      console.error('Storage initialization failed:', error);
    }
  };

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      console.log('Notifications initialized');
    } catch (error) {
      console.error('Notification initialization failed:', error);
    }
  };

  const initializeLocalization = async () => {
    try {
      // Load saved language preference
      const settings = await storageService.getSettings();
      if (settings?.language) {
        localizationService.setLanguage(settings.language as any);
      }
      console.log('Localization initialized');
    } catch (error) {
      console.error('Localization initialization failed:', error);
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="light" />
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <Text style={styles.loadingText}>Loading Vshots...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#FF6B35',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  errorMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});