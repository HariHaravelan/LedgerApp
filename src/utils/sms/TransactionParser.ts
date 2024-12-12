import { SMSTransaction, SMSTransactionType } from "../../types/Transaction";


export class TransactionParser {
    private readonly TRANSACTION_PATTERNS = {
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
  
    parseTransaction(sms: any, accounts: Account[]): SMSTransaction | null {
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
  
    private extractAmount(body: string): number | null {
      const patterns = [
        /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
        /(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?:rs\.?|inr|₹)/i,
        /(?:amount|amt|amount of|amt of).*?(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
        /(?:rs\.?|inr|₹).*?(\d+(?:,\d+)*(?:\.\d{2})?)/i,
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
  
    private extractBalance(body: string): number | undefined {
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
  
    private determineTransactionType(body: string): SMSTransactionType {
      const lowerBody = body.toLowerCase();
      
      if (this.isTransfer(lowerBody)) return 'transfer';
      if (this.isDebit(lowerBody)) return 'debit';
      if (this.isCredit(lowerBody)) return 'credit';
      
      return this.inferTypeFromContext(lowerBody);
    }
  
    private isTransfer(text: string): boolean {
      return this.TRANSACTION_PATTERNS.transfer.some(keyword => text.includes(keyword)) &&
             (text.includes('between') || (text.includes('from') && text.includes('to')));
    }
  
    private isDebit(text: string): boolean {
      return this.TRANSACTION_PATTERNS.debit.some(keyword => text.includes(keyword));
    }
  
    private isCredit(text: string): boolean {
      return this.TRANSACTION_PATTERNS.credit.some(keyword => text.includes(keyword));
    }
  
    private inferTypeFromContext(text: string): SMSTransactionType {
      if (text.includes('to') || text.includes('paid')) return 'debit';
      if (text.includes('from')) return 'credit';
      return 'unknown';
    }
  
    private matchAccountFromSMS(smsText: string, accounts: Account[]): Account | undefined {
      const lowerText = smsText.toLowerCase();
      
      // Try matching by account number first
      const accountMatch = accounts.find(account => 
        account.name && lowerText.includes(account.name.slice(-4))
      );
      if (accountMatch) return accountMatch;
  
      // Fall back to institution and type matching
      return accounts.find(account => {
        if (!lowerText.includes(account.institution.toLowerCase())) return false;
  
        switch (account.type.name) {
          case 'card': return lowerText.includes('card');
          case 'bank': return lowerText.includes('account') || lowerText.includes('a/c');
          case 'wallet': return lowerText.includes(account.subType.name.toLowerCase());
          default: return false;
        }
      });
    }
  
    private extractMerchant(body: string): string | undefined {
      const patterns = [
        /(?:at|to|@)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
        /(?:purchase at|paid to|transferred to)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i,
        /(?:from)\s+([A-Za-z0-9\s&'-]+?)(?=\s+(?:on|for|rs|inr|₹|\d|$))/i
      ];
  
      for (const pattern of patterns) {
        const match = body.match(pattern);
        if (match?.[1]) {
          const merchant = match[1].trim();
          if (!this.isCommonNonMerchantTerm(merchant)) {
            return merchant;
          }
        }
      }
      return undefined;
    }
  
    private isCommonNonMerchantTerm(text: string): boolean {
      return /^(account|upi|card|bank|transfer|payment)$/i.test(text);
    }
  }
  