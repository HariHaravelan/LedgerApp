// src/screens/SetupWizardScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Animated,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BANK_COLORS, colors, WIZARD_COLORS } from '../../constants/colors';
import { SMSHandler, DetectedAccount } from '../../utils/SMSHandler';

interface SetupWizardProps {
    onComplete: () => void;
}

const SetupWizardScreen: React.FC<SetupWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [progress] = useState(new Animated.Value(0));
    const [detectedAccounts, setDetectedAccounts] = useState<DetectedAccount[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Animate progress bar
        Animated.timing(progress, {
            toValue: (step - 1) / 2, // 3 steps total
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [step]);

    const handleScanAccounts = async () => {
        try {
            setIsScanning(true);
            const accounts = await SMSHandler.detectAccounts();
            setDetectedAccounts(accounts);

            // Pre-select all accounts
            setSelectedAccounts(new Set(accounts.map(acc => acc.id)));
            setStep(2);
        } catch (error) {
            Alert.alert('Error', 'Failed to scan messages. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const toggleAccount = (accountId: string) => {
        const newSelected = new Set(selectedAccounts);
        if (newSelected.has(accountId)) {
            newSelected.delete(accountId);
        } else {
            newSelected.add(accountId);
        }
        setSelectedAccounts(newSelected);
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Scan Bank Messages';
            case 2: return 'Verify Your Accounts';
            case 3: return 'All Set!';
            default: return '';
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 1:
                return {
                    title: 'Detect Your Accounts',
                    description: 'We\'ll scan your SMS messages to find all your financial accounts including bank accounts, credit cards, loans, investments, and digital wallets.',
                    buttonText: 'Start Detection',
                    scanningText: 'Scanning Messages...'
                };
            case 2:
                return 'We found these accounts in your messages. Select the ones you want to track.';
            case 3:
                return 'Your accounts are ready! You can start tracking your transactions now.';
            default:
                return '';
        }
    };

    const renderAccountCard = (account: DetectedAccount) => {
        const isSelected = selectedAccounts.has(account.id);
        const lastTransactionDate = new Date(account.lastTransaction).toLocaleDateString();
        const bankColor = BANK_COLORS[account.institution] || BANK_COLORS.default;

        return (
            <TouchableOpacity
                key={account.id}
                style={[styles.accountCard, isSelected && styles.accountCardSelected]}
                onPress={() => toggleAccount(account.id)}
                activeOpacity={0.8}
            >

                <View style={styles.accountHeader}>
                    <View style={styles.accountInfo}>
                        <View style={[styles.bankBadge, { backgroundColor: bankColor }]}>
                            <Text style={styles.bankBadgeText}>{account.institution}</Text>
                        </View>
                        <Text style={styles.accountType}>
                            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        </Text>
                    </View>
                    <View style={[
                        styles.checkCircle,
                        isSelected && styles.checkCircleSelected
                    ]}>
                        {isSelected && (
                            <Icon name="checkmark" size={16} color={colors.white} />
                        )}
                    </View>
                </View>
                <View style={styles.accountDetails}>
                    <Text style={styles.accountNumber}>
                        ••••{account.accountNumber}
                    </Text>
                    <Text style={styles.lastTransaction}>
                        Last activity: {lastTransactionDate}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.iconContainer}>
                            <Icon name="phone-portrait-outline" size={64} color={colors.primary} />
                        </View>
                        <TouchableOpacity
                            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
                            onPress={handleScanAccounts}
                            disabled={isScanning}
                        >
                            <Icon
                                name={isScanning ? 'sync' : 'scan'}
                                size={24}
                                color={colors.white}
                                style={[
                                    isScanning && styles.spinningIcon
                                ]}
                            />
                            <Text style={styles.scanButtonText}>
                                {isScanning ? 'Scanning Messages...' : 'Start Scan'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContent}>
                        <ScrollView style={styles.accountsList}>
                            {detectedAccounts.map(renderAccountCard)}
                        </ScrollView>
                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                selectedAccounts.size === 0 && styles.nextButtonDisabled
                            ]}
                            onPress={() => setStep(3)}
                            disabled={selectedAccounts.size === 0}
                        >
                            <Text style={styles.nextButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 3:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.successContainer}>
                            <Icon name="checkmark-circle" size={80} color={colors.primary} />
                            <Text style={styles.successText}>
                                {selectedAccounts.size} {selectedAccounts.size === 1 ? 'account' : 'accounts'} added successfully
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={onComplete}
                        >
                            <Text style={styles.completeButtonText}>Get Started</Text>
                            <Icon name="arrow-forward" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Ledger</Text>
                <Text style={styles.subtitle}>Let's set up your accounts</Text>
            </View>

            <View style={styles.progress}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })
                        }
                    ]}
                />
            </View>

            <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>{getStepTitle()}</Text>
                <Text style={styles.stepDescription}>{getStepDescription()}</Text>
            </View>

            {renderStep()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WIZARD_COLORS.surface,
    },
    header: {
        padding: 24,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 28, // Slightly reduced from 32
        fontWeight: '700',
        color: colors.text, // Back to theme color
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textLight, // Back to theme color
    },
    progress: {
        height: 4,
        backgroundColor: `${colors.primary}15`,
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    stepHeader: {
        padding: 24,
        backgroundColor: colors.white,
    },
    stepTitle: {
        fontSize: 20, // Slightly reduced from 24
        fontWeight: '600',
        color: colors.text, // Back to theme color
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 14,
        color: colors.textLight, // Back to theme color
        lineHeight: 20,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginBottom: 32,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WIZARD_COLORS.accent1,
        padding: 18,
        borderRadius: 16,
        gap: 12,
        elevation: 2,
        shadowColor: WIZARD_COLORS.accent1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    scanButtonDisabled: {
        opacity: 0.7,
    },
    accountCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    accountCardSelected: {

        borderWidth: 2,
    },
    bankBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    bankBadgeText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 13,
    },
    accountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    accountInfo: {
        flex: 1,
    },
    bankName: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    accountType: {
        fontSize: 14,
        color: colors.text,
        backgroundColor: `${WIZARD_COLORS.accent2}15`,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    checkCircleSelected: {
        backgroundColor: WIZARD_COLORS.accent1,
        borderColor: WIZARD_COLORS.accent1,
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: `${WIZARD_COLORS.accent1}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginTop: 16,
        textAlign: 'center',
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WIZARD_COLORS.gradient1,
        padding: 18,
        borderRadius: 16,
        gap: 8,
        elevation: 2,
        shadowColor: WIZARD_COLORS.gradient1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    stepContent: {
        flex: 1,
        padding: 24,
    },

    scanButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    spinningIcon: {
        ...(Platform.OS === 'ios' ? {
            transform: [{ rotate: '360deg' }],
        } : {}),
    },
    accountsList: {
        flex: 1,
    },

    accountDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accountNumber: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    lastTransaction: {
        fontSize: 12,
        color: colors.textLight,
    },
    nextButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    nextButtonDisabled: {
        opacity: 0.6,
    },
    nextButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },

    completeButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SetupWizardScreen;