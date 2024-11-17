export const accounts: Account[] = [
    // Bank Accounts
    {
        id: '1',
        type: 'bank',
        name: 'HDFC Savings',
        balance: 25000,
        institution: 'HDFC Bank',
        lastSync: '2024-03-16T10:30:00',
    },
    {
        id: '2',
        type: 'bank',
        name: 'SBI Savings',
        balance: 45000,
        institution: 'State Bank of India',
        lastSync: '2024-03-16T09:15:00',
    },

    // Wallets
    {
        id: '3',
        type: 'wallet',
        name: 'Paytm Wallet',
        balance: 2500,
        institution: 'Paytm',
        lastSync: '2024-03-16T11:00:00',
    },
    {
        id: '4',
        type: 'wallet',
        name: 'Amazon Pay',
        balance: 1500,
        institution: 'Amazon',
        lastSync: '2024-03-16T10:45:00',
    },

    // Credit Cards
    {
        id: '5',
        type: 'card',
        name: 'HDFC Credit Card',
        balance: -15000,
        institution: 'HDFC Bank',
        lastSync: '2024-03-16T11:00:00',
    },
    {
        id: '6',
        type: 'card',
        name: 'Amazon Pay Card',
        balance: -5000,
        institution: 'ICICI Bank',
        lastSync: '2024-03-16T10:45:00',
    },

    // Loans
    {
        id: '7',
        type: 'loan',
        name: 'Home Loan',
        balance: -2500000,
        institution: 'HDFC Bank',
        lastSync: '2024-03-16T09:30:00',
    },
    {
        id: '8',
        type: 'loan',
        name: 'Car Loan',
        balance: -500000,
        institution: 'ICICI Bank',
        lastSync: '2024-03-16T09:30:00',
    },

    // Investments
    {
        id: '9',
        type: 'investment',
        name: 'HDFC FD',
        balance: 100000,
        institution: 'HDFC Bank',
        investmentType: 'fd',
        lastSync: '2024-03-15T18:20:00',
    },
    {
        id: '10',
        type: 'investment',
        name: 'Post Office RD',
        balance: 50000,
        institution: 'Post Office',
        investmentType: 'rd',
        lastSync: '2024-03-15T18:20:00',
    },
    {
        id: '11',
        type: 'investment',
        name: 'Mutual Funds',
        balance: 7500000,
        institution: 'Groww',
        investmentType: 'mutual_funds',
        lastSync: '2024-03-16T09:30:00',
    },
    {
        id: '12',
        type: 'investment',
        name: 'Stocks Portfolio',
        balance: 125000,
        institution: 'Zerodha',
        investmentType: 'stocks',
        lastSync: '2024-03-16T09:30:00',
    },
];

export const ACCOUNT_SUBTYPES: Record<MainAccountType, DropdownOption[]> = {
    bank: [
        { value: 'savings', label: 'Savings' },
        { value: 'current', label: 'Current' },
        { value: 'nre', label: 'NRE' },
        { value: 'nro', label: 'NRO' },
        { value: 'ppf', label: 'PPF' }
    ],
    wallet: [
        { value: 'paytm', label: 'Paytm' },
        { value: 'phonepe', label: 'PhonePe' },
        { value: 'gpay', label: 'Google Pay' },
        { value: 'amazonpay', label: 'Amazon Pay' },
        { value: 'other', label: 'Other' }
    ],
    card: [
        { value: 'credit', label: 'Credit Card' },
        { value: 'food', label: 'Food Card' },
        { value: 'fuel', label: 'Fuel Card' },
        { value: 'travel', label: 'Travel Card' },
        { value: 'other', label: 'Other' }
    ],
    loan: [
        { value: 'personal', label: 'Personal' },
        { value: 'home', label: 'Home' },
        { value: 'vehicle', label: 'Vehicle' },
        { value: 'education', label: 'Education' },
        { value: 'business', label: 'Business' }
    ],
    investment: [
        { value: 'stocks', label: 'Stocks' },
        { value: 'mutual_funds', label: 'Mutual Funds' },
        { value: 'bonds', label: 'Bonds' },
        { value: 'sgb', label: 'Sovereign Gold' },
        { value: 'crypto', label: 'Crypto' },
        { value: 'fd', label: 'Fixed Deposit' },
        { value: 'rd', label: 'Recurring Deposit' }
    ]
};

export const ACCOUNT_TYPE_OPTIONS: DropdownOption[] = [
    { value: 'bank', label: 'Bank Account', icon: 'business-outline' },
    { value: 'wallet', label: 'E-Wallet', icon: 'wallet-outline' },
    { value: 'card', label: 'Cards', icon: 'card-outline' },
    { value: 'loan', label: 'Loans', icon: 'cash-outline' },
    { value: 'investment', label: 'Investments', icon: 'trending-up-outline' },
];