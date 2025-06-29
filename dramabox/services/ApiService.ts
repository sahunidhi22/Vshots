// API service for Vshots app backend integration
// This service handles all HTTP requests to the backend API

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  coins: number;
  level: number;
  subscriptionType: 'free' | 'premium' | 'vip';
  subscriptionExpiry?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface Video {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  category: string;
  genre: string;
  tags: string[];
  views: number;
  likes: number;
  isFavorite: boolean;
  isLocked: boolean;
  requiredLevel?: number;
  episodes?: Episode[];
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  isLocked: boolean;
  requiredLevel?: number;
  createdAt: string;
}

export interface WatchHistoryEntry {
  id: string;
  videoId: string;
  episodeId?: string;
  progress: number;
  watchedAt: string;
  completed: boolean;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'earned' | 'spent';
  amount: number;
  description: string;
  source: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  type: 'premium' | 'vip';
  price: number;
  duration: number; // days
  features: string[];
  isPopular?: boolean;
}

class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    // In production, this would be your actual API URL
    this.baseUrl = __DEV__ 
      ? 'http://localhost:3000/api' 
      : 'https://api.vshots.app';
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.authToken = token;
  }

  // Clear authentication token
  clearAuthToken() {
    this.authToken = null;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async resetPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // User methods
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request('/user/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async uploadAvatar(imageUri: string): Promise<ApiResponse<{ avatarUrl: string }>> {
    // In a real app, you'd handle file upload here
    return this.request('/user/avatar', {
      method: 'POST',
      body: JSON.stringify({ imageUri }),
    });
  }

  // Video methods
  async getVideos(params?: {
    category?: string;
    genre?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Video[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/videos?${queryParams.toString()}`);
  }

  async getVideo(id: string): Promise<ApiResponse<Video>> {
    return this.request(`/videos/${id}`);
  }

  async likeVideo(videoId: string): Promise<ApiResponse> {
    return this.request(`/videos/${videoId}/like`, {
      method: 'POST',
    });
  }

  async unlikeVideo(videoId: string): Promise<ApiResponse> {
    return this.request(`/videos/${videoId}/like`, {
      method: 'DELETE',
    });
  }

  async addToFavorites(videoId: string): Promise<ApiResponse> {
    return this.request(`/videos/${videoId}/favorite`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(videoId: string): Promise<ApiResponse> {
    return this.request(`/videos/${videoId}/favorite`, {
      method: 'DELETE',
    });
  }

  // Watch history methods
  async getWatchHistory(page?: number, limit?: number): Promise<ApiResponse<WatchHistoryEntry[]>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return this.request(`/user/watch-history?${params.toString()}`);
  }

  async updateWatchProgress(
    videoId: string,
    progress: number,
    episodeId?: string
  ): Promise<ApiResponse> {
    return this.request('/user/watch-progress', {
      method: 'POST',
      body: JSON.stringify({ videoId, episodeId, progress }),
    });
  }

  async clearWatchHistory(): Promise<ApiResponse> {
    return this.request('/user/watch-history', {
      method: 'DELETE',
    });
  }

  // Coins and transactions
  async getCoinsBalance(): Promise<ApiResponse<{ coins: number }>> {
    return this.request('/user/coins');
  }

  async getTransactions(page?: number, limit?: number): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return this.request(`/user/transactions?${params.toString()}`);
  }

  async earnCoins(source: string, amount: number): Promise<ApiResponse<{ newBalance: number }>> {
    return this.request('/user/earn-coins', {
      method: 'POST',
      body: JSON.stringify({ source, amount }),
    });
  }

  async spendCoins(amount: number, description: string): Promise<ApiResponse<{ newBalance: number }>> {
    return this.request('/user/spend-coins', {
      method: 'POST',
      body: JSON.stringify({ amount, description }),
    });
  }

  // Daily check-in
  async checkIn(): Promise<ApiResponse<{ coins: number; streak: number }>> {
    return this.request('/user/check-in', {
      method: 'POST',
    });
  }

  async getCheckInStatus(): Promise<ApiResponse<{ canCheckIn: boolean; streak: number }>> {
    return this.request('/user/check-in/status');
  }

  // Subscriptions
  async getSubscriptionPlans(): Promise<ApiResponse<Subscription[]>> {
    return this.request('/subscriptions/plans');
  }

  async purchaseSubscription(planId: string, paymentMethod: string): Promise<ApiResponse> {
    return this.request('/subscriptions/purchase', {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethod }),
    });
  }

  async getSubscriptionStatus(): Promise<ApiResponse<{
    type: 'free' | 'premium' | 'vip';
    expiresAt?: string;
    autoRenew: boolean;
  }>> {
    return this.request('/user/subscription');
  }

  // Downloads
  async getDownloadUrl(videoId: string, quality: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.request(`/videos/${videoId}/download?quality=${quality}`);
  }

  async reportDownload(videoId: string, status: 'started' | 'completed' | 'failed'): Promise<ApiResponse> {
    return this.request('/user/downloads', {
      method: 'POST',
      body: JSON.stringify({ videoId, status }),
    });
  }

  // Search
  async search(query: string, filters?: {
    category?: string;
    genre?: string;
    duration?: string;
  }): Promise<ApiResponse<Video[]>> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    return this.request(`/search?${params.toString()}`);
  }

  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return this.request(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Analytics
  async trackVideoView(videoId: string, duration: number): Promise<ApiResponse> {
    return this.request('/analytics/video-view', {
      method: 'POST',
      body: JSON.stringify({ videoId, duration }),
    });
  }

  async trackUserAction(action: string, metadata?: Record<string, any>): Promise<ApiResponse> {
    return this.request('/analytics/user-action', {
      method: 'POST',
      body: JSON.stringify({ action, metadata }),
    });
  }

  // Push notifications
  async registerPushToken(token: string, platform: string): Promise<ApiResponse> {
    return this.request('/notifications/register-token', {
      method: 'POST',
      body: JSON.stringify({ token, platform }),
    });
  }

  async updateNotificationPreferences(preferences: Record<string, boolean>): Promise<ApiResponse> {
    return this.request('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Admin methods (for testing)
  async getAppConfig(): Promise<ApiResponse<{
    features: Record<string, boolean>;
    minimumVersion: string;
    maintenanceMode: boolean;
  }>> {
    return this.request('/config');
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Mock API responses for development
export const mockApiResponses = {
  login: {
    success: true,
    data: {
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        coins: 1000,
        level: 5,
        subscriptionType: 'premium' as const,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token',
    },
  },
  
  videos: {
    success: true,
    data: [], // Would be populated with actual video data
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5,
    },
  },
  
  checkIn: {
    success: true,
    data: {
      coins: 50,
      streak: 7,
    },
  },
};
