import type { AccountType, AccountSubType, Account, DropdownOption } from '../types/Account';

export const ACCOUNT_TYPES: AccountType[] = [
    { id: '1', name: "bank" },
    { id: '2', name: "wallet" },
    { id: '3', name: "card" },
    { id: '4', name: "investments" },
    { id: '5', name: "loan" },
];


export const ACCOUNT_SUBTYPES: AccountSubType[] = [

    { id: '1', name: 'savings', type: ACCOUNT_TYPES[0] },
    { id: '2', name: 'current', type: ACCOUNT_TYPES[0] },
    { id: '3', name: 'paytm', type: ACCOUNT_TYPES[1] },
    { id: '4', name: 'amazonpay', type: ACCOUNT_TYPES[1] },
    { id: '5', name: 'other', type: ACCOUNT_TYPES[1] },
    { id: '6', name: 'food', type: ACCOUNT_TYPES[2] },
    { id: '7', name: 'credit', type: ACCOUNT_TYPES[2] },
    { id: '8', name: 'fuel', type: ACCOUNT_TYPES[2] },
    { id: '9', name: 'other', type: ACCOUNT_TYPES[2] },
    { id: '10', name: 'personal', type: ACCOUNT_TYPES[4] },
    { id: '11', name: 'home', type: ACCOUNT_TYPES[4] },
    { id: '12', name: 'vehicle', type: ACCOUNT_TYPES[4] },
    { id: '13', name: 'education', type: ACCOUNT_TYPES[4] },
    { id: '14', name: 'business', type: ACCOUNT_TYPES[4] },
    { id: '15', name: 'stocks', type: ACCOUNT_TYPES[3] },
    { id: '16', name: 'mutual_funds', type: ACCOUNT_TYPES[3] },
    { id: '17', name: 'bonds', type: ACCOUNT_TYPES[3] },
    { id: '18', name: 'SGB', type: ACCOUNT_TYPES[3] },
    { id: '19', name: 'crypto', type: ACCOUNT_TYPES[3] },
    { id: '20', name: 'FD', type: ACCOUNT_TYPES[3] },
    { id: '21', name: 'RD', type: ACCOUNT_TYPES[3] },
];


export const accounts: Account[] = [
    // Bank Accounts
    {
        id: '1',
        type: ACCOUNT_TYPES[0],
        subType: ACCOUNT_SUBTYPES[0], // savings
        name: 'HDFC Savings',
        balance: 25000,
        institution: 'HDFC Bank',
        lastSync: '2024-03-16T10:30:00',
    },
    {
        id: '2',
        type: ACCOUNT_TYPES[0],
        subType: ACCOUNT_SUBTYPES[0], // savings
        name: 'SBI Savings',
        balance: 45000,
        institution: 'State Bank of India',
        lastSync: '2024-03-16T09:15:00',
    },

    // Wallets
    {
        id: '3',
        type: ACCOUNT_TYPES[1],
        subType: ACCOUNT_SUBTYPES[2], // paytm
        name: 'Paytm Wallet',
        balance: 2500,
        institution: 'Paytm',
        lastSync: '2024-03-16T11:00:00',
    },
    {
        id: '4',
        type: ACCOUNT_TYPES[1],
        subType: ACCOUNT_SUBTYPES[3], // amazonpay
        name: 'Amazon Pay',
        balance: 1500,
        institution: 'Amazon',
        lastSync: '2024-03-16T10:45:00',
    },

    // Credit Cards
    {
        id: '5',
        type: ACCOUNT_TYPES[2],
        subType: ACCOUNT_SUBTYPES[6], // credit
        name: 'HDFC Credit Card',
        balance: -15000,
        institution: 'HDFC Bank',
        lastSync: '2024-03-16T11:00:00',
    },
    {
        id: '6',
        type: ACCOUNT_TYPES[2],
        subType: ACCOUNT_SUBTYPES[6], // credit
        name: 'Amazon Pay Card',
        balance: -5000,
        institution: 'ICICI Bank',
        lastSync: '2024-03-16T10:45:00',
    },

    // Loans
    {
        id: '7',
        type: ACCOUNT_TYPES[4],
        subType: ACCOUNT_SUBTYPES[11], // home
        name: 'Home Loan',
        balance: -2500000,
        institution: 'HDFC Bank',
        lastSync: '2024-03-16T09:30:00',
    },
    {
        id: '8',
        type: ACCOUNT_TYPES[4], // Changed from 3 to 5 for loans
        subType: ACCOUNT_SUBTYPES[12], // vehicle
        name: 'Car Loan',
        balance: -500000,
        institution: 'ICICI Bank',
        lastSync: '2024-03-16T09:30:00',
    },

    // Investments
    {
        id: '9',
        type: ACCOUNT_TYPES[3],
        subType: ACCOUNT_SUBTYPES[19], // fd
        name: 'HDFC FD',
        balance: 100000,
        institution: 'HDFC Bank',
        investmentType: 'fd',
        lastSync: '2024-03-15T18:20:00',
    },
    {
        id: '10',
        type: ACCOUNT_TYPES[3],
        subType: ACCOUNT_SUBTYPES[20], // rd
        name: 'Post Office RD',
        balance: 50000,
        institution: 'Post Office',
        investmentType: 'rd',
        lastSync: '2024-03-15T18:20:00',
    },
    {
        id: '11',
        type: ACCOUNT_TYPES[3],
        subType: ACCOUNT_SUBTYPES[15], // mutual_funds
        name: 'Mutual Funds',
        balance: 7500000,
        institution: 'Groww',
        investmentType: 'mutual_funds',
        lastSync: '2024-03-16T09:30:00',
    },
    {
        id: '12',
        type: ACCOUNT_TYPES[3],
        subType: ACCOUNT_SUBTYPES[14], // stocks
        name: 'Stocks Portfolio',
        balance: 125000,
        institution: 'Zerodha',
        investmentType: 'stocks',
        lastSync: '2024-03-16T09:30:00',
    },
];

export const ACCOUNT_TYPE_OPTIONS: DropdownOption[] = [
    {
        value: ACCOUNT_TYPES[0].id,  // bank
        label: 'Bank Account',
        icon: 'business-outline'
    },
    {
        value: ACCOUNT_TYPES[1].id,  // wallet
        label: 'E-Wallet',
        icon: 'wallet-outline'
    },
    {
        value: ACCOUNT_TYPES[2].id,  // card
        label: 'Cards',
        icon: 'card-outline'
    },
    {
        value: ACCOUNT_TYPES[4].id,  // loan
        label: 'Loans',
        icon: 'cash-outline'
    },
    {
        value: ACCOUNT_TYPES[3].id,  // investments
        label: 'Investments',
        icon: 'trending-up-outline'
    },
    // { 
    //     value: ACCOUNT_TYPES[5].name,  // others
    //     label: 'Others',
    //     icon: 'ellipsis-horizontal-outline'  // Common icon for "other" categories
    //   }
];
