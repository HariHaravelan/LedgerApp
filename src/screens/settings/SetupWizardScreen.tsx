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
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BANK_COLORS, colors, WIZARD_COLORS } from '../../constants/colors';
import { DetectedAccount } from '../../types/SMSTypes';
import { SMSHandler } from '../../utils/SMSHandler';
import { truncateText } from '../../utils/formatting';

const { width: screenWidth } = Dimensions.get('window');
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

    const handleEdit = (account: DetectedAccount) => {
        // Handle edit functionality
        console.log('Edit account:', account.id);
    };

    const groupAccountsByType = (accounts: DetectedAccount[]) => {
        const groups = accounts.reduce((acc, account) => {
            if (!acc[account.type]) {
                acc[account.type] = [];
            }
            acc[account.type].push(account);
            return acc;
        }, {} as Record<string, DetectedAccount[]>);

        // Sort accounts within each group by institution name
        Object.keys(groups).forEach(type => {
            groups[type].sort((a, b) => a.institution.localeCompare(b.institution));
        });

        return groups;
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'wallet':
                return 'wallet-outline';
            case 'account':
                return 'cash-outline';
            case 'card':
                return 'card-outline';
            case 'loan':
                return 'trending-up-outline';
            default:
                return 'business-outline';
        }
    };

    const formatLastTransaction = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return 'Today';
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

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

    const renderAccountCard = (account: DetectedAccount) => (
        <TouchableOpacity
            key={account.id}
            style={[
                styles.accountCard,
                selectedAccounts.has(account.id) && styles.accountCardSelected
            ]}
            onPress={() => toggleAccount(account.id)}
            activeOpacity={0.7}
        >
            {/* Selection indicator */}
            <View style={[
                styles.selectionIndicator,
                selectedAccounts.has(account.id) && styles.selectionIndicatorSelected
            ]}>
                <Icon
                    name={selectedAccounts.has(account.id) ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={selectedAccounts.has(account.id) ? "#2E5BFF" : colors.border}
                />
            </View>

            {/* Account Info */}
            <View style={styles.mainContent}>
                <View style={styles.bankInfo}>
                    <Text style={styles.bankName}> {truncateText(account.institution, 20)}</Text>
                    <Text style={styles.accountNumber}>•••• {account.accountNumber}</Text>
                </View>

                <View style={styles.transactionInfo}>
                    <Icon name="time-outline" size={12} color={colors.textLight} />
                    <Text style={styles.lastSync}>
                        Last transaction: {formatLastTransaction(new Date(account.lastTransaction))}
                    </Text>
                </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(account)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Icon name="pencil" size={16} color={colors.textLight} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

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
                        <View style={styles.actionContainer}>
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

                    </View>
                );
            case 2:
                const groupedAccounts = groupAccountsByType(detectedAccounts);

                return (
                    <View style={styles.stepContentContainer}>
                        <ScrollView
                            style={styles.accountsList}
                            contentContainerStyle={styles.accountsListContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {Object.entries(groupedAccounts).map(([type, accounts]) => (
                                <View key={type} style={styles.accountGroup}>
                                    <View style={styles.groupHeader}>
                                        <Icon name={getTypeIcon(type)} size={18} color={colors.text} />
                                        <Text style={styles.groupTitle}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </Text>
                                        <View style={styles.accountCount}>
                                            <Text style={styles.accountCountText}>{accounts.length}</Text>
                                        </View>
                                    </View>

                                    {accounts.map((account, index) => (
                                        <View key={account.id}>
                                            {renderAccountCard(account)}
                                            {index < accounts.length - 1 && <View style={styles.cardDivider} />}
                                        </View>
                                    ))}
                                </View>
                            ))}
                            <View style={styles.scrollPadding} />
                        </ScrollView>

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
                        {/* Success Icon Section */}
                        <View style={styles.successContent}>
                            <View style={styles.successIconContainer}>
                                {/* Using same styling pattern as step 1 icons */}
                                <View style={[styles.iconCircle, { backgroundColor: `${WIZARD_COLORS.success}15` }]}>
                                    <Icon name="checkmark" size={40} color={WIZARD_COLORS.success} />
                                </View>
                            </View>

                            {/* Success Messages */}
                            <View style={styles.successMessages}>
                                <Text style={styles.accountsConnected}>
                                    {selectedAccounts.size} {selectedAccounts.size === 1 ? 'account' : 'accounts'} connected
                                </Text>
                                <Text style={styles.successDescription}>
                                    Track your transactions easily with SMS notifications. Just tap the SMS icon whenever you want to scan for new transactions.
                                </Text>
                            </View>

                            {/* Tips Section - using same styling as step 1 features */}
                            <View style={styles.featuresList}>
                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIcon, { backgroundColor: `${WIZARD_COLORS.success}10` }]}>
                                        <Icon name="scan-outline" size={24} color={WIZARD_COLORS.success} />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={styles.featureTitle}>SMS Scanner</Text>
                                        <Text style={styles.featureDescription}>
                                            Import transactions from bank messages
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIcon, { backgroundColor: `${colors.primary}10` }]}>
                                        <Icon name="create-outline" size={24} color={colors.primary} />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={styles.featureTitle}>Manual Entry</Text>
                                        <Text style={styles.featureDescription}>
                                            Add and edit transactions as needed
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Action Button - using same green as continue button */}
                        <TouchableOpacity
                            style={styles.getStartedButton}
                            onPress={onComplete}
                        >
                            <Text style={styles.getStartedText}>Get Started</Text>
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
    groupTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        flex: 1,
    },
    accountCount: {
        backgroundColor: `${colors.primary}15`,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    accountCountText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        marginHorizontal: 16,
    },

    // Add a new divider style
    cardDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 10,
    },

    // Update accountGroup style to remove any conflicting margins
    accountGroup: {
        marginBottom: 16,
    },

    // Update accountCardSelected to match the new flat design
    accountCardSelected: {
        backgroundColor: `${colors.primary}08`,
        borderLeftColor: colors.income,
    },

    // Update the accountGroup style for the new stacked look


    // Update groupHeader for better visual hierarchy
    groupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    // Update accountsList styles
    accountsList: {
        flex: 1,
    },

    accountsListContent: {
        paddingVertical: 12,
    },

    // Helper separator style for cards
    separator: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 16,
    },

    // Update mainContent for better alignment
    mainContent: {
        flex: 1,
        marginLeft: 12,
    },

    // Update bankInfo for cleaner layout
    bankInfo: {
        marginBottom: 4,
    },

    // Update selection indicator position
    selectionIndicator: {
        marginRight: 16,
    },

    // Update edit button to be less prominent
    editButton: {
        padding: 8,
        marginLeft: 8,
    },

    selectionIndicatorSelected: {
        transform: [{ scale: 1.1 }],
    },
    bankName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    accountNumber: {
        fontSize: 14,
        color: colors.textLight,
    },
    transactionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lastSync: {
        fontSize: 12,
        color: colors.textLight,
    },

    bankContainer: {
        flex: 1,
        borderRadius: 8,
        padding: 8,
    },

    bankLogo: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    bankInitials: {
        color: colors.white,
        fontSize: 5,
        fontWeight: '600',
    },
    accountInfo: {
        flex: 1,
    },

    stepContentContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollPadding: {
        height: 20, // Extra padding at the bottom of scroll content
    },

    actionContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },

    cardLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    bankLogoContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: `${colors.primary}08`,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bankBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    bankBadgeText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 12,
    },
    accountDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    accountTypeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.primary}10`,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
    },
    accountType: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    checkCircleSelected: {
        backgroundColor: '#10B981', // Matching the border color
        borderColor: '#10B981',
    },
    accountMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: `${colors.border}40`,
        gap: 4,
    },
    lastActivity: {
        fontSize: 12,
        color: colors.textLight,
    },
    continueButtonText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '600',
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
    successContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    successIconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successMessages: {
        alignItems: 'center',
        marginBottom: 32,
    },
    accountsConnected: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    successDescription: {
        fontSize: 14,
        color: colors.textLight,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    featuresList: {
        paddingHorizontal: 16,
        gap: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
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
    getStartedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WIZARD_COLORS.success,
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginHorizontal: 20,
        marginBottom: Platform.OS === 'ios' ? 34 : 24,
    },
    getStartedText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.white,
    },
    stepContent: {
        flex: 1,
        backgroundColor: colors.white,
    },

    tipsContainer: {
        width: '100%',
        gap: 12,
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background,
        borderRadius: 12,
        gap: 12,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
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