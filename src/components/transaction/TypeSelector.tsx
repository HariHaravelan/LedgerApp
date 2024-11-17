import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TransactionType } from "../../types/Transaction";
import { colors } from "../../constants/colors";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

interface TypeSelectorProps {
    selected: TransactionType;
    onSelect: (type: TransactionType) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ selected, onSelect }) => (
    <View style={styles.typeSelector}>
        <TouchableOpacity
            style={[styles.typeButton, selected === 'expense' && styles.activeExpenseButton]}
            onPress={() => onSelect('expense')}
        >
            <Icon
                name="arrow-down"
                size={18}
                color={selected === 'expense' ? colors.white : colors.error}
            />
            <Text style={[
                styles.typeButtonText,
                selected === 'expense' && styles.activeTypeButtonText
            ]}>
                Expense
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.typeButton, selected === 'income' && styles.activeIncomeButton]}
            onPress={() => onSelect('income')}
        >
            <Icon
                name="arrow-up"
                size={18}
                color={selected === 'income' ? colors.white : colors.success}
            />
            <Text style={[
                styles.typeButtonText,
                selected === 'income' && styles.activeTypeButtonText
            ]}>
                Income
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    typeSelector: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    activeExpenseButton: {
        backgroundColor: colors.error,
        borderColor: colors.error,
    },
    activeIncomeButton: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    typeButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    activeTypeButtonText: {
        color: colors.white,
    },
});