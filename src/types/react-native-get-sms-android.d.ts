// src/types/react-native-get-sms-android.d.ts
declare module 'react-native-get-sms-android' {
    interface SmsAndroid {
      list(
        filter: string,
        failureCallback: (error: any) => void,
        successCallback: (count: number, messages: string) => void
      ): void;
    }
  
    const smsAndroid: SmsAndroid;
    export default smsAndroid;
  }