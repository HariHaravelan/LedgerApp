import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
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

interface ModalDropdownProps {
  label: string;
  placeholder: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  showIcon?: boolean;
}

// Reusable Modal Dropdown Component
const ModalDropdown: React.FC<ModalDropdownProps> = ({
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

// Main Component
interface AddAccountScreenProps {
  onClose: () => void;
}

const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ onClose }) => {
  const [accountType, setAccountType] = useState('');
  const [accountSubtype, setAccountSubtype] = useState('');
  const [nickname, setNickname] = useState('');
  const [balance, setBalance] = useState('');
  const [notes, setNotes] = useState('');

  const subtypeOptions = accountType ? ACCOUNT_SUBTYPES[accountType] : [];

  const handleAccountTypeChange = (type: string) => {
    setAccountType(type);
    setAccountSubtype(''); // Reset subtype when main type changes
  };

  const canSave = accountType && accountSubtype && nickname && balance;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Account</Text>
        <TouchableOpacity 
          onPress={onClose}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          disabled={!canSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ModalDropdown
            label="Account Type"
            placeholder="Select Account Type"
            options={ACCOUNT_TYPE_OPTIONS}
            selectedValue={accountType}
            onSelect={handleAccountTypeChange}
            showIcon
          />

          <ModalDropdown
            label="Account Subtype"
            placeholder="Select Account Subtype"
            options={subtypeOptions}
            selectedValue={accountSubtype}
            onSelect={setAccountSubtype}
            showIcon
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Nickname *</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="E.g., Personal Savings, Emergency Fund"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Balance *</Text>
            <TextInput
              style={styles.input}
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
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
        elevation: 5,
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

export default AddAccountScreen;