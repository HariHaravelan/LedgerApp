import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, WIZARD_COLORS } from '../../../constants/colors';
import { FeaturesList } from './FeaturesList';

interface SuccessStepProps {
    selectedCount: number;
    onComplete: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ selectedCount, onComplete }) => (
    <View style={styles.stepContent}>
        <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
                <View style={[styles.iconCircle, { backgroundColor: `${WIZARD_COLORS.success}15` }]}>
                    <Icon name="checkmark" size={40} color={WIZARD_COLORS.success} />
                </View>
            </View>

            <View style={styles.successMessages}>
                <Text style={styles.accountsConnected}>
                    {selectedCount} {selectedCount === 1 ? 'account' : 'accounts'} connected
                </Text>
                <Text style={styles.successDescription}>
                    Track your transactions easily with SMS notifications. Just tap the SMS icon whenever you want to scan for new transactions.
                </Text>
            </View>

            <View style={styles.featuresList}>
                <FeatureItem
                    icon="scan-outline"
                    title="SMS Scanner"
                    description="Import transactions from bank messages"
                />
                <FeatureItem
                    icon="create-outline"
                    title="Manual Entry"
                    description="Add and edit transactions as needed"
                />
            </View>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={onComplete}>
            <Text style={styles.getStartedText}>Get Started</Text>
            <Icon name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
    </View>
);

interface FeatureItemProps {
    icon: string;
    title: string;
    description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
    <View style={styles.featureItem}>
        <View style={[styles.featureIcon, { backgroundColor: `${colors.primary}10` }]}>
            <Icon name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    stepContent: {
        flex: 1,
        backgroundColor: colors.white,
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
});