// src/utils/CategoryMatcher.ts

import type { Account } from '../types/Account';

interface CategoryKeywords {
    [key: string]: {
      keywords: string[];
      icon: string;
    };
  }
  
  // Expense categories with their associated keywords
  const EXPENSE_CATEGORIES: CategoryKeywords = {
    'food-dining': {
      keywords: [
        'swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'dining', 
        'burger', 'pizza', 'hotel', 'eat', 'lunch', 'dinner'
      ],
      icon: 'restaurant-outline'
    },
    'shopping': {
      keywords: [
        'amazon', 'flipkart', 'myntra', 'retail', 'shop', 'store', 'mart',
        'mall', 'purchase', 'buy', 'shopping'
      ],
      icon: 'cart-outline'
    },
    'transportation': {
      keywords: [
        'uber', 'ola', 'rapido', 'metro', 'bus', 'train', 'fuel', 'petrol',
        'diesel', 'parking', 'toll', 'transport'
      ],
      icon: 'car-outline'
    },
    'utilities': {
      keywords: [
        'electricity', 'water', 'gas', 'internet', 'wifi', 'broadband',
        'phone', 'mobile', 'bill', 'recharge', 'dth', 'utility'
      ],
      icon: 'flash-outline'
    },
    'entertainment': {
      keywords: [
        'movie', 'theatre', 'netflix', 'amazon prime', 'hotstar', 'spotify',
        'game', 'entertainment', 'ticket'
      ],
      icon: 'film-outline'
    },
    'health': {
      keywords: [
        'hospital', 'clinic', 'doctor', 'medicine', 'pharmacy', 'medical',
        'health', 'healthcare', 'apollo', 'pharma'
      ],
      icon: 'medical-outline'
    }
  };
  
  // Income categories with their associated keywords
  const INCOME_CATEGORIES: CategoryKeywords = {
    'salary': {
      keywords: [
        'salary', 'sal', 'monthly', 'wage', 'payroll', 'income',
        'compensation', 'pay'
      ],
      icon: 'wallet-outline'
    },
    'investment': {
      keywords: [
        'dividend', 'interest', 'mutual fund', 'stock', 'investment',
        'return', 'deposit', 'fd', 'rd'
      ],
      icon: 'trending-up-outline'
    },
    'refund': {
      keywords: [
        'refund', 'cashback', 'return', 'reimbursement', 'repayment'
      ],
      icon: 'refresh-outline'
    }
  };
  
  export class CategoryMatcher {
    static findCategory(text: string, type: 'credit' | 'debit'): { id: string; name: string; icon: string } {
      const lowerText = text.toLowerCase();
      const categories = type === 'credit' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
      for (const [categoryId, data] of Object.entries(categories)) {
        if (data.keywords.some(keyword => lowerText.includes(keyword))) {
          return {
            id: categoryId,
            name: categoryId.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            icon: data.icon
          };
        }
      }
  
      // Default categories if no match found
      return type === 'credit' 
        ? { id: 'other-income', name: 'Other Income', icon: 'cash-outline' }
        : { id: 'other-expense', name: 'Other Expense', icon: 'apps-outline' };
    }
  
    static extractMerchant(text: string): string | undefined {
      // Try to extract merchant name using common patterns
      const patterns = [
        /at\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
        /to\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
        /from\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i
      ];
  
      for (const pattern of patterns) {
        const match = text.match(pattern);
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
  
    static matchAccountFromSMS = (smsText: string, accounts: Account[]): Account | undefined => {
        return accounts.find(account => {
          const institutionMatch = smsText.toLowerCase().includes(account.institution.toLowerCase());
          const nameMatch = smsText.toLowerCase().includes(account.name.toLowerCase());
          return institutionMatch || nameMatch;
        });
      };

    static enrichTransaction(smsTransaction: any) {
      const category = this.findCategory(smsTransaction.body, smsTransaction.type);
      const merchantName = this.extractMerchant(smsTransaction.body) || 'Unknown';
  
      return {
        ...smsTransaction,
        category,
        merchantName,
        remarks: `SMS Transaction: ${merchantName}`
      };
    }
  }
