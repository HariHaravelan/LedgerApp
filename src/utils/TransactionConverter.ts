// src/utils/TransactionConverter.ts

import type { SMSTransaction, SMSTransactionType, TransactionType, Transaction, Category } from '../types/Transaction';
import type { Account } from '../types/Account';
import { CategoryMatcher } from './CategoryMatcher';

interface TransactionConverterConfig {
  defaultAccount: Account;
  categories: Category[];
  accounts: Account[];
}

export class TransactionConverter {
  private config: TransactionConverterConfig;

  constructor(config: TransactionConverterConfig) {
    this.config = config;
  }


  // Find the best matching category based on SMS content and type
  private findCategory(sms: SMSTransaction): Category {
    // Use CategoryMatcher to find the appropriate category
    const suggestedCategory = CategoryMatcher.findCategory(
      sms.body,
      sms.type as 'credit' | 'debit'
    );
    
    // Find matching category from available categories
    const matchedCategory = this.config.categories.find(
      cat => cat.id === suggestedCategory.id
    );

    // Return matched category or first available category as fallback
    return matchedCategory || this.config.categories[0];
  }

  // Generate remarks from SMS content
  private generateRemarks(sms: SMSTransaction): string {
    const merchantInfo = sms.merchantName ? `${sms.merchantName} - ` : '';
    const balanceInfo = sms.balance ? ` (Balance: ₹${sms.balance})` : '';
    return `${merchantInfo}${sms.body.slice(0, 100)}${balanceInfo}`;
  }

  private convertDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  public convertType(smsType: SMSTransactionType): TransactionType {
    switch (smsType) {
      case 'debit':
        return 'expense';
      case 'credit':
        return 'income';
      case 'transfer':
        return 'transfer';
      case 'unknown':
        return 'expense';  // Default to expense for unknown types
    }
  }

  public convert(sms: SMSTransaction): Transaction {
    // Use the matched account if available, otherwise use default
    const account = this.config.accounts.find(acc => acc.id === sms.account) 
      || this.config.defaultAccount;
  
    return {
      id: sms.id,
      type: this.convertType(sms.type),
      amount: Math.abs(sms.amount),
      category: this.findCategory(sms),
      account,
      toAccount: undefined, // Handle transfer case if needed
      date: this.convertDate(sms.date),
      remarks: this.generateRemarks(sms)
    };
  }

  public convertMultiple(smsTransactions: SMSTransaction[]): Transaction[] {
    return smsTransactions.map(sms => this.convert(sms));
  }
}

// Example usage:
/*
const config = {
  defaultAccount: {
    id: 'default',
    name: 'Primary Account',
    type: 'bank',
    balance: 0
  },
  categories: [
    { id: 'food', name: 'Food & Dining', icon: 'restaurant' },
    { id: 'shopping', name: 'Shopping', icon: 'cart' },
    // ... other categories
  ],
  accounts: [
    { 
      id: 'hdfc',
      name: 'HDFC Account',
      type: 'bank',
      accountNumber: '****1234',
      balance: 10000
    },
    // ... other accounts
  ]
};

const converter = new TransactionConverter(config);

const smsTransactions: SMSTransaction[] = [...];
const transactions: Transaction[] = converter.convertMultiple(smsTransactions);
*/
