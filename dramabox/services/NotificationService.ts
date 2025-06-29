import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // Request permissions
      await this.requestPermissions();

      this.initialized = true;
      console.log('NotificationService initialized successfully');
    } catch (error) {
      console.error('Error initializing NotificationService:', error);
    }
  }

  async requestPermissions(): Promise<{ status: string; canAskAgain: boolean }> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return {
        status: finalStatus,
        canAskAgain: finalStatus !== 'denied',
      };
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return {
        status: 'denied',
        canAskAgain: false,
      };
    }
  }

  async sendLocalNotification(notification: NotificationData): Promise<string | null> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        },
        trigger: null, // Send immediately
      });

      console.log('Local notification sent:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error sending local notification:', error);
      return null;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
export default NotificationService;
