import { TransactionData, PeriodOption } from '../types/Stats';

export const periodOptions: PeriodOption[] = [
    { value: 'weekly', label: 'Weekly', icon: 'calendar-outline' },
    { value: 'monthly', label: 'Monthly', icon: 'calendar-outline' },
    { value: 'annually', label: 'Annually', icon: 'calendar-outline' },
    { value: 'custom', label: 'Custom', icon: 'calendar-outline' },
];

export const incomeData: TransactionData[] = [
    {
        name: 'Salary',
        value: 75000,
        color: '#10B981',
        transactions: 1,
        trend: 5.2
    },
    {
        name: 'Freelance',
        value: 15000,
        color: '#3B82F6',
        transactions: 3,
        trend: -2.1
    },
    {
        name: 'Investments',
        value: 10000,
        color: '#6366F1',
        transactions: 4,
        trend: 12.5
    },
    {
        name: 'Other',
        value: 5000,
        color: '#8B5CF6',
        transactions: 2,
        trend: 0
    },
];

export const expenseData: TransactionData[] = [
    {
        name: 'Rent',
        value: 25000,
        color: '#EF4444',
        transactions: 1,
        trend: 0
    },
    {
        name: 'Shopping',
        value: 15000,
        color: '#8B5CF6',
        transactions: 8,
        trend: 15.2
    },
    {
        name: 'Food',
        value: 12000,
        color: '#F59E0B',
        transactions: 15,
        trend: 8.3
    },
    {
        name: 'Bills',
        value: 10000,
        color: '#6366F1',
        transactions: 5,
        trend: 2.1
    },
    {
        name: 'Transport',
        value: 8000,
        color: '#EC4899',
        transactions: 22,
        trend: -5.7
    },

];
