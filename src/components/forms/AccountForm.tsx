import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { ACCOUNT_SUBTYPES, ACCOUNT_TYPE_OPTIONS } from '../../data/AccountsData';

// Types
interface Option {
    value: string;
    label: string;
    icon?: string;
}

interface AccountFormProps {
    formData: AccountFormData;
    onChange: (data: AccountFormData) => void;
    onSubmit: (data: AccountFormData) => void;
}

// Reusable Modal Dropdown Component
const ModalDropdown: React.FC<{
    label: string;
    placeholder: string;
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
    showIcon?: boolean;
}> = ({
    label,
    placeholder,
    options,
    selectedValue,
    onSelect,
    showIcon = false,
}) => {
        const [isModalVisible, setIsModalVisible] = useState(false);
        const selectedOption = options.find(opt => opt.value === selectedValue);
        return (
            <>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{label}</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <View style={styles.dropdownContent}>
                            {showIcon && selectedOption?.icon && (
                                <Icon
                                    name={selectedOption.icon}
                                    size={20}
                                    color={colors.text}
                                    style={styles.dropdownIcon}
                                />
                            )}
                            <Text style={[
                                styles.dropdownText,
                                !selectedOption && styles.placeholderText
                            ]}>
                                {selectedOption?.label || placeholder}
                            </Text>
                        </View>
                        <Icon name="chevron-down" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                </View>

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
                                <Text style={styles.modalTitle}>{label}</Text>
                                <TouchableOpacity
                                    onPress={() => setIsModalVisible(false)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Icon name="close" size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView bounces={false}>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.optionItem}
                                        onPress={() => {
                                            onSelect(option.value);
                                            setIsModalVisible(false);
                                        }}
                                    >
                                        <View style={styles.optionContent}>
                                            {showIcon && option.icon && (
                                                <Icon
                                                    name={option.icon}
                                                    size={20}
                                                    color={selectedValue === option.value ? colors.primary : colors.text}
                                                    style={styles.optionIcon}
                                                />
                                            )}
                                            <Text style={[
                                                styles.optionText,
                                                selectedValue === option.value && styles.selectedOptionText
                                            ]}>
                                                {option.label}
                                            </Text>
                                        </View>
                                        {selectedValue === option.value && (
                                            <Icon name="checkmark" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </Pressable>
                </Modal>
            </>
        );
    };

const AccountForm: React.FC<AccountFormProps> = ({
    formData,
    onChange,
    onSubmit,
}) => {

    const getSubTypesByAccountType = (accountTypeId: string, subTypes: AccountSubType[]): AccountSubType[] => {
        return subTypes.filter(subType => subType.type.id === accountTypeId);
    };
    // Get available subtypes based on selected type
    const subtypes = formData.typeId ? getSubTypesByAccountType(formData.typeId, ACCOUNT_SUBTYPES) : [];

    const transformAccountSubtypes = (subtypes: AccountSubType[]): Option[] => {
        return subtypes.map(subtype => ({
            value: subtype.id, // Convert id to string for value
            label: subtype.name
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '), // Format the name for label
            // Optional: Add icons if needed
        }));
    }

    const updateField = (field: string, value: number): void => {
        throw new Error('Function not implemented.');
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContent}>
                <ModalDropdown
                    label="Account Type"
                    placeholder="Select Account Type"
                    options={ACCOUNT_TYPE_OPTIONS}
                    selectedValue={formData.typeId}
                    onSelect={(value) => onChange({ ...formData, typeId: value })}
                    showIcon
                />

                <ModalDropdown
                    label="Account Subtype"
                    placeholder="Select Account Subtype"
                    options={transformAccountSubtypes(subtypes)}
                    selectedValue={formData.subtypeId}
                    onSelect={(value) => onChange({ ...formData, subtypeId: value })}
                    showIcon
                />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Account Nickname *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => onChange({ ...formData, name: value })}
                        placeholder="E.g., Personal Savings, Emergency Fund"
                        placeholderTextColor={colors.textLight}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Current Balance *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.balance}
                        onChangeText={(value) => onChange({ ...formData, balance: value })}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor={colors.textLight}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.notesInput]}
                        value={formData.notes}
                        onChangeText={(value) =>onChange({ ...formData, notes: value })}
                        placeholder="Add any additional notes"
                        placeholderTextColor={colors.textLight}
                        multiline
                        numberOfLines={3}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    formContent: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: colors.text,
    },
    notesInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
    },
    dropdownContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dropdownIcon: {
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: colors.text,
    },
    placeholderText: {
        color: colors.textLight,
    },
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
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    optionText: {
        fontSize: 16,
        color: colors.text,
    },
    selectedOptionText: {
        color: colors.primary,
        fontWeight: '500',
    },
});

export default AccountForm;