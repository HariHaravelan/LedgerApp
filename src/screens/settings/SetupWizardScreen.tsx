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
import { DetectedAccount } from '../../types/SMSTypes';
import { SMSHandler } from '../../utils/SMSHandler';


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
            case 1: return 'Link Your Accounts';
            case 2: return 'Verify Your Accounts';
            case 3: return 'All Set!';
            default: return '';
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 1:
                return 'We analyze your transaction messages to set up automatic tracking. Your data never leaves your device.';
            case 2:
                return 'We found these accounts in your messages. Select the ones you want to track.';
            case 3:
                return 'Your accounts are ready! You can start tracking your transactions now.';
            default:
                return '';
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.stepContent}>
                        {/* Hero Section */}
                        <View style={styles.heroSection}>
                            <View style={styles.iconRow}>
                                <View style={[styles.iconCircle, { backgroundColor: `${WIZARD_COLORS.accent1}15` }]}>
                                    <Icon name="wallet-outline" size={32} color={WIZARD_COLORS.accent1} />
                                </View>
                                <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}15` }]}>
                                    <Icon name="card-outline" size={32} color={colors.primary} />
                                </View>
                                <View style={[styles.iconCircle, { backgroundColor: `${WIZARD_COLORS.accent2}15` }]}>
                                    <Icon name="phone-portrait-outline" size={32} color={WIZARD_COLORS.accent2} />
                                </View>
                            </View>
                        </View>

                        {/* Features List */}
                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <View style={styles.featureIcon}>
                                    <Icon name="shield-checkmark-outline" size={24} color={colors.primary} />
                                </View>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>Private & Secure</Text>
                                    <Text style={styles.featureDescription}>Your data stays on your device</Text>
                                </View>
                            </View>

                            <View style={styles.featureItem}>
                                <View style={styles.featureIcon}>
                                    <Icon name="sync-outline" size={24} color={colors.primary} />
                                </View>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>Auto Detection</Text>
                                    <Text style={styles.featureDescription}>Quick account setup from messages</Text>
                                </View>
                            </View>

                            <View style={styles.featureItem}>
                                <View style={styles.featureIcon}>
                                    <Icon name="time-outline" size={24} color={colors.primary} />
                                </View>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>Real-time Updates</Text>
                                    <Text style={styles.featureDescription}>Stay on top of your transactions</Text>
                                </View>
                            </View>
                        </View>

                        {/* Action Button */}
                        <TouchableOpacity
                            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
                            onPress={handleScanAccounts}
                            disabled={isScanning}
                        >
                            <View style={styles.scanButtonContent}>
                                <Icon
                                    name={isScanning ? 'sync' : 'search-outline'}
                                    size={24}
                                    color={colors.white}
                                    style={[isScanning && styles.spinningIcon]}
                                />
                                <Text style={styles.scanButtonText}>
                                    {isScanning ? 'Detecting Accounts...' : 'Start Detection'}
                                </Text>
                            </View>
                        </TouchableOpacity>


                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContent}>
                      

                        {/* Accounts List */}
                        <ScrollView
                            style={styles.accountsList}
                            showsVerticalScrollIndicator={false}
                        >
                            {detectedAccounts.map(account => (
                                <TouchableOpacity
                                    key={account.id}
                                    style={[
                                        styles.accountCard,
                                        selectedAccounts.has(account.id) && styles.accountCardSelected
                                    ]}
                                    onPress={() => toggleAccount(account.id)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.accountHeader}>
                                        <View style={styles.accountInfo}>
                                            <View style={[
                                                styles.bankBadge,
                                                { backgroundColor: BANK_COLORS[account.institution] || BANK_COLORS.default }
                                            ]}>
                                                <Text style={styles.bankBadgeText}>{account.institution}</Text>
                                            </View>

                                            <Text style={styles.accountNumber}>
                                                ••••{account.accountNumber}
                                            </Text>
                                            <Text style={styles.accountType}>
                                                {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                                            </Text>
                                        </View>
                                        <View style={[
                                            styles.checkCircle,
                                            selectedAccounts.has(account.id) && styles.checkCircleSelected
                                        ]}>
                                            {selectedAccounts.has(account.id) && (
                                                <Icon name="checkmark" size={16} color={colors.white} />
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.accountMeta}>
                                        <Icon name="time-outline" size={14} color={colors.textLight} />
                                        <Text style={styles.lastActivity}>
                                            Last activity: {new Date(account.lastTransaction).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Action Button */}
                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.continueButton,
                                    selectedAccounts.size === 0 && styles.continueButtonDisabled
                                ]}
                                onPress={() => setStep(3)}
                                disabled={selectedAccounts.size === 0}
                            >
                                <Text style={styles.continueButtonText}>
                                    Continue with {selectedAccounts.size} {selectedAccounts.size === 1 ? 'account' : 'accounts'}
                                </Text>
                                <Icon name="arrow-forward" size={20} color={colors.white} />
                            </TouchableOpacity>
                        </View>
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
            <View style={styles.centerSection}>
                <Icon
                    name="wallet-outline"
                    size={18}
                    color={colors.text}
                    style={styles.titleIcon}
                />
                <Text style={styles.title}>Ledger</Text>
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
        padding: 20,  // Reduced padding
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectText: {
        fontSize: 14,
        color: colors.textLight,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: colors.white,
    },
    accountsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981', // Green color
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    continueButtonDisabled: {
        opacity: 0.6,
    },
    title: {
        fontSize: 18,  // Reduced from 28
        fontWeight: '600',  // Slightly reduced weight
        color: colors.text,
        marginBottom: 4,  // Reduced spacing
    },
    titleIcon: {
        marginRight: 6,
    },
    subtitle: {
        fontSize: 14,  // Reduced from 16
        color: colors.textLight,
    },
    centerSection: {
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
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
        padding: 20,
        backgroundColor: colors.white,
    },
    stepTitle: {
        fontSize: 18, // Slightly reduced from 24
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
    stepSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    sectionText: {
        fontSize: 14,
        color: colors.textLight,
        textAlign: 'center',
        marginTop: 12,
    },
    accountCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    accountCardSelected: {
        borderColor: colors.primary,
        borderWidth: 2,
        backgroundColor: `${colors.primary}02`,
    },
    accountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    accountInfo: {
        flex: 1,
        gap: 6,
    },
    accountNumber: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    accountType: {
        fontSize: 13,
        color: colors.textLight,
        backgroundColor: `${colors.primary}08`,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    accountMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 4,
    },
    lastActivity: {
        fontSize: 12,
        color: colors.textLight,
    },
    actionContainer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.white,
    },

    continueButtonText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '600',
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

    bankName: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
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
        backgroundColor: colors.primary,
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
    accountDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featuresList: {
        marginBottom: 32,
        padding: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: colors.textLight,
    },
    scanButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    footerNote: {
        marginTop: 'auto',
        padding: 16,
        backgroundColor: `${colors.primary}05`,
        borderRadius: 12,
    },
    footerText: {
        fontSize: 13,
        color: colors.textLight,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default SetupWizardScreen;