// src/utils/SMSHandler.ts

import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { SMSTransaction, SMSTransactionType } from '../types/Transaction';

export class SMSHandler {
  // Transaction type detection keywords
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
      'transferred', 'transfer', 'moved', 'sent to', 'received from',
      'neft', 'imps', 'upi', 'rtgs'
    ]
  };

  /**
   * Request SMS read permission on Android
   */
  static async requestPermission(): Promise<boolean> {
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

  /**
   * Extract amount from SMS text
   */
  static extractAmount(body: string): number | null {
    const patterns = [
      /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,  // Rs. 1,234.56
      /(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?:rs\.?|inr|₹)/i,  // 1,234.56 Rs.
      /(?:amount|amt|amount of|amt of).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,  // Amount of Rs. 1,234.56
      /(?:rs\.?|inr|₹).*?(\d+(?:,\d+)*(?:\.\d{2})?)/i,  // Rs...1,234.56
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

  /**
   * Extract balance from SMS text
   */
  static extractBalance(body: string): number | undefined {
    const patterns = [
      /(?:bal|balance|available balance).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
      /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?:bal|balance|available)/i
    ];

    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match) {
        const cleanAmount = match[1].replace(/,/g, '');
        return parseFloat(cleanAmount);
      }
    }
    return undefined;
  }

  /**
   * Match account from SMS text
   */
  static matchAccountFromSMS(smsText: string, accounts: Account[]): Account | undefined {
    const lowerText = smsText.toLowerCase();
    
    // Match by account number or card number
    for (const account of accounts) {
      if (account.name && lowerText.includes(account.name.slice(-4))) {
        return account;
      }
    }

    // Match by institution and account type
    for (const account of accounts) {
      const institutionMatch = lowerText.includes(account.institution.toLowerCase());
      if (!institutionMatch) continue;

      switch (account.type.name) {
        case 'card':
          if (lowerText.includes('card')) return account;
          break;
        case 'bank':
          if (lowerText.includes('account') || lowerText.includes('a/c')) return account;
          break;
        case 'wallet':
          if (lowerText.includes(account.subType.name.toLowerCase())) return account;
          break;
      }
    }

    return undefined;
  }

  /**
   * Determine transaction type from SMS text
   */
  static determineTransactionType(body: string): SMSTransactionType {
    const lowerBody = body.toLowerCase();
    
    // Check for transfer first
    if (this.KEYWORDS.transfer.some(keyword => lowerBody.includes(keyword))) {
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

    // Use contextual clues as fallback
    if (lowerBody.includes('to') || lowerBody.includes('paid')) {
      return 'debit';
    }
    if (lowerBody.includes('from')) {
      return 'credit';
    }

    return 'unknown';
  }

  /**
   * Extract merchant name from SMS text
   */
  static extractMerchant(body: string): string | undefined {
    const patterns = [
      /(?:at|to|@)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
      /(?:purchase at|paid to|transferred to)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
      /(?:from)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i
    ];

    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        const merchant = match[1].trim();
        // Filter out common non-merchant strings
        if (!merchant.match(/^(account|upi|card|bank|transfer|payment)$/i)) {
          return merchant;
        }
      }
    }
    return undefined;
  }

  /**
   * Parse a single SMS into a transaction
   */
  static parseTransaction(sms: any, accounts: Account[]): SMSTransaction | null {
    try {
      const amount = this.extractAmount(sms.body);
      if (!amount) return null;

      const type = this.determineTransactionType(sms.body);
      if (type === 'unknown') return null;

      const account = this.matchAccountFromSMS(sms.body, accounts);

      return {
        id: sms._id || String(new Date().getTime()),
        type,
        amount,
        date: new Date(parseInt(sms.date)),
        sender: sms.address,
        body: sms.body,
        merchantName: this.extractMerchant(sms.body),
        balance: this.extractBalance(sms.body),
        account: account?.id
      };
    } catch (error) {
      console.error('Error parsing transaction:', error);
      return null;
    }
  }

  /**
   * Read and parse SMS messages within date range
   */
  static async readTransactions(
    startDate: Date,
    endDate: Date,
    accounts: Account[]
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
                  const transaction = this.parseTransaction(sms, accounts);
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