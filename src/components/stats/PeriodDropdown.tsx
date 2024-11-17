import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { PeriodType } from '../../types/Stats';
import { periodOptions } from '../../data/StatsData';

interface PeriodDropdownProps {
    visible: boolean;
    selectedPeriod: PeriodType;
    onClose: () => void;
    onSelect: (period: PeriodType) => void;
}

export const PeriodDropdown: React.FC<PeriodDropdownProps> = ({
    visible,
    selectedPeriod,
    onClose,
    onSelect,
}) => {
    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.dropdownContainer}>
                            <View style={styles.dropdownHeader}>
                                <Text style={styles.dropdownTitle}>Select View</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Icon name="close" size={24} color={colors.textLight} />
                                </TouchableOpacity>
                            </View>
                            {periodOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.dropdownOption,
                                        selectedPeriod === option.value && styles.dropdownOptionSelected
                                    ]}
                                    onPress={() => {
                                        onSelect(option.value);
                                        onClose();
                                    }}
                                >
                                    <Icon
                                        name={option.icon}
                                        size={20}
                                        color={selectedPeriod === option.value ? colors.primary : colors.text}
                                    />
                                    <Text style={[
                                        styles.dropdownOptionText,
                                        selectedPeriod === option.value && styles.dropdownOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {selectedPeriod === option.value && (
                                        <Icon name="checkmark" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    dropdownContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dropdownTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    dropdownOptionText: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
    },
    dropdownOptionTextSelected: {
        color: colors.primary,
        fontWeight: '500',
    }, dropdownOptionSelected: {
        backgroundColor: `${colors.primary}10`,
    }, dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
});