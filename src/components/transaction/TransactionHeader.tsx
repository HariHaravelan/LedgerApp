import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface Props {
    onClose: () => void;
    onSave: () => void;
    canSave: boolean;
}

export const TransactionHeader: React.FC<Props> = ({ onClose, onSave, canSave }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity
            onPress={onSave}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        >
            <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                Save
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    saveButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: colors.primary,
    },
    saveButtonDisabled: {
        backgroundColor: colors.border,
    },
    saveButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
    saveButtonTextDisabled: {
        color: colors.textLight,
    },
});