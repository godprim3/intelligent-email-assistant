import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  constructor() {
    // Default to localhost for development
    // In production, this should be configured through environment variables
    this.baseURL = __DEV__ 
      ? 'http://localhost:8081' 
      : 'https://your-production-api.com';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard APIs
  async getDashboardStats() {
    try {
      const stats = await this.request('/api/dashboard/stats');
      return stats;
    } catch (error) {
      console.log('Using mock dashboard stats due to API error:', error.message);
      // Return mock data as fallback
      return {
        totalEmails: 156,
        urgentEmails: 3,
        autoResponses: 42,
        processedToday: 23,
      };
    }
  }

  async triggerEmailProcessing() {
    try {
      const result = await this.request('/api/emails/process', {
        method: 'POST',
      });
      return result;
    } catch (error) {
      console.log('Using mock processing result due to API error:', error.message);
      return {
        success: true,
        message: 'Email processing started (mock)',
        processedCount: Math.floor(Math.random() * 10) + 1,
      };
    }
  }

  // Email APIs
  async getEmails(page = 0, size = 20) {
    try {
      const emails = await this.request(`/api/emails?page=${page}&size=${size}`);
      return emails;
    } catch (error) {
      console.log('Using mock emails due to API error:', error.message);
      // Return mock data as fallback
      return {
        content: [
          {
            id: '1',
            subject: 'Quarterly Report Review',
            sender: 'john.doe@company.com',
            receivedAt: new Date().toISOString(),
            priority: 'HIGH',
            processed: true,
            requiresAttention: true,
            category: 'WORK',
            summary: 'Quarterly financial report needs immediate review and approval.',
          },
          {
            id: '2',
            subject: 'Meeting Confirmation',
            sender: 'scheduler@meetings.com',
            receivedAt: new Date(Date.now() - 3600000).toISOString(),
            priority: 'MEDIUM',
            processed: true,
            requiresAttention: false,
            category: 'MEETING',
            summary: 'Automated confirmation for tomorrow\'s team meeting.',
          },
          {
            id: '3',
            subject: 'Welcome to our Newsletter',
            sender: 'newsletter@company.com',
            receivedAt: new Date(Date.now() - 7200000).toISOString(),
            priority: 'LOW',
            processed: true,
            requiresAttention: false,
            category: 'NEWSLETTER',
            summary: 'Welcome email from company newsletter subscription.',
          },
        ],
        totalElements: 3,
        totalPages: 1,
        first: true,
        last: true,
      };
    }
  }

  async getEmailById(emailId) {
    try {
      const email = await this.request(`/api/emails/${emailId}`);
      return email;
    } catch (error) {
      console.log(`Using mock email data for ID ${emailId} due to API error:`, error.message);
      return {
        id: emailId,
        subject: 'Mock Email Subject',
        sender: 'mock@example.com',
        receivedAt: new Date().toISOString(),
        priority: 'MEDIUM',
        processed: true,
        requiresAttention: false,
        category: 'OTHER',
        summary: 'This is a mock email summary.',
        content: 'This is the full content of a mock email for testing purposes.',
      };
    }
  }

  // Notifications APIs
  async getNotifications() {
    try {
      const notifications = await this.request('/api/notifications');
      return notifications;
    } catch (error) {
      console.log('Using mock notifications due to API error:', error.message);
      return [
        {
          id: '1',
          type: 'urgent',
          title: 'Urgent Email from CEO',
          message: 'Important meeting scheduled for tomorrow at 9 AM',
          time: '2 mins ago',
          read: false,
        },
        {
          id: '2',
          type: 'auto_response',
          title: 'Auto-response sent',
          message: 'Replied to customer support inquiry automatically',
          time: '15 mins ago',
          read: false,
        },
      ];
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const result = await this.request(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      return result;
    } catch (error) {
      console.log('Mock notification marked as read due to API error:', error.message);
      return { success: true };
    }
  }

  // Settings APIs
  async getUserSettings() {
    try {
      const settings = await this.request('/api/user/settings');
      return settings;
    } catch (error) {
      console.log('Using mock user settings due to API error:', error.message);
      return {
        pushNotifications: true,
        whatsappNotifications: true,
        autoResponses: true,
        processingSchedule: 'EVERY_5_MINUTES',
        aiProvider: 'DEEPSEEK_WITH_OPENAI_FALLBACK',
      };
    }
  }

  async updateUserSettings(settings) {
    try {
      const result = await this.request('/api/user/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      return result;
    } catch (error) {
      console.log('Mock settings update due to API error:', error.message);
      return { success: true, settings };
    }
  }

  // Health check
  async checkHealth() {
    try {
      const health = await this.request('/actuator/health');
      return health;
    } catch (error) {
      console.log('API health check failed:', error.message);
      return { status: 'DOWN', error: error.message };
    }
  }

  // Utility methods
  async storeAuthToken(token) {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  }

  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token;
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  }

  async removeAuthToken() {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  }
}

export default new ApiService();
