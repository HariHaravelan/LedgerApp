import { PermissionsAndroid, Platform } from "react-native";

export class PermissionManager {
    async requestSMSPermission(): Promise<boolean> {
      if (Platform.OS !== 'android') return false;
  
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'SMS Permission',
            message: 'App needs access to read your SMS messages to scan transactions.',
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
  }