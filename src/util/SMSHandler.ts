// src/utils/SMSHandler.ts
import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { SMSTransaction } from '../types/Transaction';

export class SMSHandler {
  // Keywords indicating transaction types
  private static readonly KEYWORDS = {
    debit: [
      'debited', 'spent', 'withdrawn', 'paid', 'payment', 'purchase', 
      'debit', 'sent', 'charged', 'paying', 'withdrawal', 'bought',
      'deducted', 'spend', 'shopping'
    ],
    credit: [
      'credited', 'received', 'deposited', 'refunded', 'cashback', 
      'credit', 'added', 'transferred', 'salary', 'income',
      'reimbursement', 'reward', 'bonus'
    ],
    transfer: [
      'transferred', 'transfer', 'moved', 'sent to', 'received from'
    ],
  };

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

  static extractAmount(body: string): number | null {
    // Match various currency formats
    const patterns = [
      /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,  // Rs. 1,234.56
      /(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?:rs\.?|inr|₹)/i,  // 1,234.56 Rs.
      /(?:amount|amt|amount of|amt of).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,  // Amount of Rs. 1,234.56
      /(?:rs\.?|inr|₹).*?(\d+(?:,\d+)*(?:\.\d{2})?)/i,  // Rs...1,234.56
      /(?<!\d)(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?=rs\.?|inr|₹)/i  // 1,234.56 followed by currency
    ];

    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match) {
        const cleanAmount = match[1].replace(/,/g, '');
        const amount = parseFloat(cleanAmount);
        return isNaN(amount) ? null : amount;
      }
    }
    return null;
  }

  static determineTransactionType(body: string): 'debit' | 'credit' | 'transfer' | 'unknown' {
    const lowerBody = body.toLowerCase();
    
    // Check for transfer keywords first
    if (this.KEYWORDS.transfer.some(keyword => lowerBody.includes(keyword))) {
      // Additional check to determine if it's a transfer between accounts
      if (lowerBody.includes('between') || 
          (lowerBody.includes('from') && lowerBody.includes('to'))) {
        return 'transfer';
      }
    }
    
    // Check for debit keywords
    if (this.KEYWORDS.debit.some(keyword => lowerBody.includes(keyword))) {
      return 'debit';
    }
    
    // Check for credit keywords
    if (this.KEYWORDS.credit.some(keyword => lowerBody.includes(keyword))) {
      return 'credit';
    }

    // Use amount position as a fallback
    const amountMatch = lowerBody.match(/(?:rs\.?|inr|₹)\s*(\d+)/i);
    if (amountMatch) {
      // If amount appears after "to" or with "paid", likely a debit
      if (lowerBody.includes('to') || lowerBody.includes('paid')) {
        return 'debit';
      }
      // If amount appears after "from", likely a credit
      if (lowerBody.includes('from')) {
        return 'credit';
      }
    }

    return 'unknown';
  }

  static extractMerchant(body: string): string | undefined {
    const patterns = [
      /(?:at|to|in|@)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
      /(?:purchase at|paid to|transferred to)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
      /(?:from)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i
    ];

    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        const merchant = match[1].trim();
        // Filter out common non-merchant strings
        if (!merchant.match(/^(inc|ltd|limited|pvt|private|bank|account|upi|card)$/i)) {
          return merchant;
        }
      }
    }
    return undefined;
  }

  static parseTransaction(sms: any): SMSTransaction | null {
    try {
      const amount = this.extractAmount(sms.body);
      if (!amount) return null;

      const type = this.determineTransactionType(sms.body);
      if (type === 'unknown') return null;

      return {
        id: sms._id || String(new Date().getTime()),
        type,
        amount,
        date: new Date(parseInt(sms.date)),
        sender: sms.address,
        body: sms.body,
        merchantName: this.extractMerchant(sms.body)
      };
    } catch (error) {
      console.error('Error parsing transaction:', error);
      return null;
    }
  }

  static async readTransactions(
    startDate: Date,
    endDate: Date
  ): Promise<SMSTransaction[]> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        throw new Error('SMS permission not granted');
      }

      const filter = JSON.stringify({
        box: 'inbox',
        minDate: startDate.getTime(),
        maxDate: endDate.getTime(),
      });

      return new Promise((resolve, reject) => {
        SmsAndroid.list(
          filter,
          (error: any) => reject(error),
          (count: number, messages: string) => {
            try {
              const parsedMessages = JSON.parse(messages);
              const transactions: SMSTransaction[] = [];

              parsedMessages.forEach((sms: any) => {
                if (typeof sms.body === 'string') {
                  const transaction = this.parseTransaction(sms);
                  if (transaction) {
                    transactions.push(transaction);
                  }
                }
              });

              resolve(transactions);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error reading transactions:', error);
      throw error;
    }
  }
}