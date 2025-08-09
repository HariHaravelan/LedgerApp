import { DetectedAccount } from "../types/SMSTypes";
import type { SMSTransaction } from "../types/Transaction";
import type { Account } from '../types/Account';
import { AccountDetector } from "./sms/AccountDetector";
import { PermissionManager } from "./sms/PermissionManager";
import { TransactionParser } from "./sms/TransactionParser";
import SmsAndroid from 'react-native-get-sms-android';

export class SMSHandler {
  private static transactionParser = new TransactionParser();
  private static accountDetector = new AccountDetector();
  private static permissionManager = new PermissionManager();

  /**
   * Read and parse SMS messages within date range
   */
  static async readTransactions(
    startDate: Date,
    endDate: Date,
    accounts: Account[]
  ): Promise<SMSTransaction[]> {
    try {
      const hasPermission = await this.permissionManager.requestSMSPermission();
      if (!hasPermission) {
        throw new Error('SMS permission not granted');
      }

      const filter = {
        box: 'inbox',
        minDate: startDate.getTime(),
        maxDate: endDate.getTime(),
      };

      return await this.fetchAndParseMessages(filter, accounts);
    } catch (error) {
      console.error('Error reading transactions:', error);
      throw error;
    }
  }

  /**
   * Detect bank accounts from SMS messages
   */
  static async detectAccounts(
    startDate: Date = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // Last 6 months
  ): Promise<DetectedAccount[]> {
    try {
      const hasPermission = await this.permissionManager.requestSMSPermission();
      if (!hasPermission) {
        throw new Error('SMS permission not granted');
      }

      const filter = {
        box: 'inbox',
        minDate: startDate.getTime(),
        maxDate: new Date().getTime(),
      };

      return await this.accountDetector.detectFromMessages(filter);
    } catch (error) {
      console.error('Error detecting accounts:', error);
      throw error;
    }
  }

  private static fetchAndParseMessages(filter: any, accounts: Account[]): Promise<SMSTransaction[]> {
    return new Promise((resolve, reject) => {
      SmsAndroid.list(
        JSON.stringify(filter),
        (error: any) => reject(error),
        (_count: number, messages: string) => {
          try {
            const parsedMessages = JSON.parse(messages);
            const transactions = this.parseMessages(parsedMessages, accounts);
            resolve(transactions);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  private static parseMessages(messages: any[], accounts: Account[]): SMSTransaction[] {
    return messages
      .filter(sms => typeof sms.body === 'string')
      .map(sms => this.transactionParser.parseTransaction(sms, accounts))
      .filter((transaction): transaction is SMSTransaction => transaction !== null);
  }
}
