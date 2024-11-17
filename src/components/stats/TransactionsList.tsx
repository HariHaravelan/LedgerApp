import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { TransactionData } from '../../types/Stats';
import { formatAmount } from '../../utils/formatting';

interface TransactionsListProps {
    data: TransactionData[];
    totalAmount: number;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
    data,
    totalAmount,
}) => {
    return (
        <View style={styles.list}>
            {data.map((item) => (
                <View key={item.name} style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                        <Text style={styles.rowName} numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>

                    <View style={styles.rowRight}>
                        <Text style={styles.rowAmount} numberOfLines={1}>
                            {formatAmount(item.value)}
                        </Text>
                        <Text style={styles.rowPercentage}>
                            {((item.value / totalAmount) * 100).toFixed(0)}%
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        backgroundColor: colors.white,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    }, rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        minWidth: 0, // Important for text truncation
        marginRight: 12,
    }, colorDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 8,
        flexShrink: 0, // Prevent dot from shrinking
    },
    rowName: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
        flex: 1,
        minWidth: 0, // Important for text truncation
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0, // Prevent right section from shrinking
        gap: 12,
        width: 140, // Fixed width for the right section
        justifyContent: 'flex-end',
    },
    rowAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'right',
        width: 90, // Fixed width for amount
    },
    rowPercentage: {
        fontSize: 12,
        color: colors.textLight,
        width: 35, // Fixed width for percentage
        textAlign: 'right',
    },
});