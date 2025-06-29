// Storage utility using Expo SecureStore for sensitive data and localStorage for general data
import * as SecureStore from 'expo-secure-store';

interface UserSettings {
  notifications: boolean;
  autoplay: boolean;
  dataMode: boolean;
  downloadWifi: boolean;
  adultContent: boolean;
  analytics: boolean;
  crashReports: boolean;
  language: string;
  videoQuality: string;
}

interface WatchHistoryItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  watchedAt: number;
  progress: number; // 0-1
  category: string;
  genre?: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  coins: number;
  level: number;
  subscriptionType: 'free' | 'premium' | 'vip';
  subscriptionExpiry?: number;
  createdAt: number;
}

class StorageService {
  // User Settings
  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await SecureStore.setItemAsync('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings(): Promise<UserSettings | null> {
    try {
      const settings = await SecureStore.getItemAsync('userSettings');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  // Watch History
  async addToWatchHistory(item: WatchHistoryItem): Promise<void> {
    try {
      const history = await this.getWatchHistory();
      const existingIndex = history.findIndex(h => h.videoId === item.videoId);
      
      if (existingIndex >= 0) {
        // Update existing entry
        history[existingIndex] = { ...history[existingIndex], ...item, watchedAt: Date.now() };
      } else {
        // Add new entry
        history.unshift(item);
      }

      // Keep only last 100 items
      const trimmedHistory = history.slice(0, 100);
      await SecureStore.setItemAsync('watchHistory', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error adding to watch history:', error);
    }
  }

  async getWatchHistory(): Promise<WatchHistoryItem[]> {
    try {
      const history = await SecureStore.getItemAsync('watchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting watch history:', error);
      return [];
    }
  }

  async clearWatchHistory(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('watchHistory');
    } catch (error) {
      console.error('Error clearing watch history:', error);
    }
  }

  async removeFromWatchHistory(videoId: string): Promise<void> {
    try {
      const history = await this.getWatchHistory();
      const filteredHistory = history.filter(item => item.videoId !== videoId);
      await SecureStore.setItemAsync('watchHistory', JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error removing from watch history:', error);
    }
  }

  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profile = await SecureStore.getItemAsync('userProfile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Authentication
  async saveAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('authToken', token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async clearAuthToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }

  // Resume Playback
  async saveVideoProgress(videoId: string, progress: number, duration: number): Promise<void> {
    try {
      const progressData = {
        videoId,
        progress,
        duration,
        updatedAt: Date.now(),
      };
      await SecureStore.setItemAsync(`progress_${videoId}`, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  }

  async getVideoProgress(videoId: string): Promise<{ progress: number; duration: number } | null> {
    try {
      const progressData = await SecureStore.getItemAsync(`progress_${videoId}`);
      if (progressData) {
        const parsed = JSON.parse(progressData);
        return { progress: parsed.progress, duration: parsed.duration };
      }
      return null;
    } catch (error) {
      console.error('Error getting video progress:', error);
      return null;
    }
  }

  // Downloaded Videos
  async saveDownloadedVideo(videoId: string, localPath: string, metadata: any): Promise<void> {
    try {
      const downloads = await this.getDownloadedVideos();
      downloads[videoId] = {
        localPath,
        metadata,
        downloadedAt: Date.now(),
      };
      await SecureStore.setItemAsync('downloadedVideos', JSON.stringify(downloads));
    } catch (error) {
      console.error('Error saving downloaded video:', error);
    }
  }

  async getDownloadedVideos(): Promise<Record<string, any>> {
    try {
      const downloads = await SecureStore.getItemAsync('downloadedVideos');
      return downloads ? JSON.parse(downloads) : {};
    } catch (error) {
      console.error('Error getting downloaded videos:', error);
      return {};
    }
  }

  async removeDownloadedVideo(videoId: string): Promise<void> {
    try {
      const downloads = await this.getDownloadedVideos();
      delete downloads[videoId];
      await SecureStore.setItemAsync('downloadedVideos', JSON.stringify(downloads));
    } catch (error) {
      console.error('Error removing downloaded video:', error);
    }
  }

  // Favorites
  async addToFavorites(videoId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(videoId)) {
        favorites.push(videoId);
        await SecureStore.setItemAsync('favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  async removeFromFavorites(videoId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter(id => id !== videoId);
      await SecureStore.setItemAsync('favorites', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  async getFavorites(): Promise<string[]> {
    try {
      const favorites = await SecureStore.getItemAsync('favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      const keys = [
        'userSettings',
        'watchHistory',
        'userProfile',
        'authToken',
        'downloadedVideos',
        'favorites',
      ];
      
      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

export const storageService = new StorageService();
export type { UserSettings, WatchHistoryItem, UserProfile };
