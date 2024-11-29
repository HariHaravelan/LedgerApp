import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

interface SMS {
  _id: string;
  address: string;
  body: string;
  date: string;
}

export class SMSReader {
  static async requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'App needs access to read your SMS messages.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  }

  static async readMessages(): Promise<SMS[]> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        throw new Error('SMS permission not granted');
      }

      const filter = JSON.stringify({
        box: 'inbox',
        minDate: Date.now() - (2 * 24 * 60 * 60 * 1000), // Last 30 days
        maxCount: 100
      });

      return new Promise((resolve, reject) => {
        SmsAndroid.list(
          filter,
          (error: any) => {
            console.error('SMS read failed:', error);
            reject(error);
          },
          (_count: number, messages: string) => {
            try {
              const parsedMessages: SMS[] = JSON.parse(messages);
              resolve(parsedMessages);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error in readMessages:', error);
      throw error;
    }
  }
}