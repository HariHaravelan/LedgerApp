// src/screens/transaction/EditTransactionScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    BackHandler,
} from 'react-native';
import { themeColors } from '../../constants/colors';
import ExpenseForm, { ExpenseFormData } from '../../components/forms/ExpenseForm';
import { ACCOUNTS, CATEGORIES } from '../../data/TransactionData';
import { IncomeForm } from '../../components/forms/IncomeForm';
import TransferForm from '../../components/forms/TransferForm';
import Icon from 'react-native-vector-icons/Ionicons';
import { Transaction } from '../../types/Transaction';


interface EditTransactionScreenProps {
    transaction: Transaction;
    onClose: () => void;
    onDelete?: () => void;
}

const EditTransactionScreen: React.FC<EditTransactionScreenProps> = ({
    transaction,
    onClose,
    onDelete
}) => {
    const [formData, setFormData] = useState<ExpenseFormData>({
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        account: transaction.account,
        date: new Date(transaction.date),
        remarks: transaction.remarks ? transaction.remarks : '',
    });

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          onClose();
          return true;
        });
    
        return () => backHandler.remove();
      }, [onClose]);

    const handleDelete = () => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (onDelete) {
                            onDelete();
                        }
                        onClose();
                    },
                },
            ],
        );
    };

    const handleSave = () => {
        // Add your save logic here
        console.log('Saving edited transaction:', {
            ...transaction,
            ...formData,
            amount: transaction.type === 'expense' ? -parseFloat(formData.amount) : parseFloat(formData.amount),
        });
        onClose();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onClose}
                    style={styles.headerButton}
                >
                    <Icon name="close" size={24} color={themeColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Transaction</Text>
                <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.headerButton}
                >
                    <Icon name="trash-outline" size={24} color={themeColors.error} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView bounces={false}>
                    {transaction.type === 'expense' && (
                        <ExpenseForm
                            data={formData}
                            onChange={setFormData}
                            categories={CATEGORIES}
                            accounts={ACCOUNTS}
                            onSave={handleSave}
                            onSaveAndContinue={handleSave}
                        />
                    )}

                    {transaction.type === 'income' && (
                        <IncomeForm
                            data={formData}
                            onChange={setFormData}
                            categories={CATEGORIES}
                            accounts={ACCOUNTS}
                            onSave={handleSave}
                            onSaveAndContinue={handleSave}
                        />
                    )}

                    {transaction.type === 'transfer' && (
                        <TransferForm
                            data={{
                                amount: formData.amount,
                                fromAccountId: formData.account,
                                toAccountId: '',
                                date: formData.date,
                                remarks: formData.remarks,
                            }}
                            onChange={(data) => {
                                setFormData({
                                    ...formData,
                                    amount: data.amount,
                                    account: data.fromAccountId,
                                    date: data.date,
                                    remarks: data.remarks,
                                });
                            }}
                            accounts={ACCOUNTS}
                            onSave={handleSave}
                            onSaveAndContinue={handleSave}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: themeColors.white,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.border,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: themeColors.text,
        letterSpacing: 0.1,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    content: {
        flex: 1,
    },
});

export default EditTransactionScreen;