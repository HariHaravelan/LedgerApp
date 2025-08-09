export interface DetectedAccount {
    id: string;
    institution: string;
    accountNumber: string;
    type: string;
    lastTransaction: Date;
    senderIds: Set<string>;
  }
  
  export interface BankPattern {
    name: string;
    patterns: RegExp[];
    accounts: {
      [key: string]: RegExp;
    };
  }
  
  export interface SMSFilter {
    box: string;
    minDate: number;
    maxDate: number;
  }
