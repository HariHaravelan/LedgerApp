import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    StyleSheet,
    Pressable,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Account } from '../../types/Transaction';
import { colors } from '../../constants/colors';

interface AccountSelectorProps {
    accounts: Account[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
    accounts,
    selectedId,
    onSelect,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const selectedAccount = accounts.find(acc => acc.id === selectedId);

    const renderAccountItem = (account: Account) => (
        <TouchableOpacity
            key={account.id}
            style={styles.accountItem}
            onPress={() => {
                onSelect(account.id);
                setIsModalVisible(false);
            }}
        >
            <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountBalance}>
                    ₹{Math.abs(account.balance).toLocaleString()}
                </Text>
            </View>
            {selectedId === account.id && (
                <Icon name="checkmark" size={20} color={colors.primary} />
            )}
        </TouchableOpacity>
    );

    return (
        <>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setIsModalVisible(true)}
            >
                <View style={styles.selectorContent}>
                    <Icon name="wallet-outline" size={20} color={colors.primary} />
                    <Text style={[
                        styles.selectorText,
                        !selectedAccount && styles.placeholderText
                    ]}>
                        {selectedAccount?.name || 'Select Account'}
                    </Text>
                </View>
                <Icon name="chevron-down" size={20} color={colors.textLight} />
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Account</Text>
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Icon name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView bounces={false}>
                            {accounts.map(renderAccountItem)}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    // Selector Button Styles
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectorText: {
        fontSize: 15,
        color: colors.text,
    },
    placeholderText: {
        color: colors.textLight,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },

    // Account Item Styles
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    accountInfo: {
        flex: 1,
        marginRight: 16,
    },
    accountName: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 4,
    },
    accountBalance: {
        fontSize: 14,
        color: colors.textLight,
    },

    // Category Item Styles
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    categoryIcon: {
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    categoryName: {
        fontSize: 16,
        color: colors.text,
    },
});