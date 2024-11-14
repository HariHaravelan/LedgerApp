// src/screens/BankAccountScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../constants/colors';

type BankAccountType = 'savings' | 'current' | 'fd' | 'rd';

interface BankAccountScreenProps {
  bankName: string;
  setBankName: (name: string) => void;
  bankBalance: string;
  setBankBalance: (balance: string) => void;
  bankAccountType: BankAccountType;
  setBankAccountType: (type: BankAccountType) => void;
}

const BankAccountScreen: React.FC<BankAccountScreenProps> = ({
  bankName,
  setBankName,
  bankBalance,
  setBankBalance,
  bankAccountType,
  setBankAccountType,
}) => {
  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9]/g, '');
    setBankBalance(numericValue);
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    isNumeric: boolean = false,
    placeholder: string = ''
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} *</Text>
      <View style={styles.inputContainer}>
        {isNumeric && <Text style={styles.currencySymbol}>₹</Text>}
        <TextInput
          style={[
            styles.input,
            isNumeric && styles.numericInput
          ]}
          value={value}
          onChangeText={isNumeric ? handleAmountChange : onChangeText}
          keyboardType={isNumeric ? 'numeric' : 'default'}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderInputField('Account Name', bankName, setBankName, false, 'Enter account name')}
      {renderInputField('Balance', bankBalance, setBankBalance, true, '0')}
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Account Type *</Text>
        <View style={styles.accountTypeContainer}>
          {(['savings', 'current', 'fd', 'rd'] as BankAccountType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.accountTypeButton,
                bankAccountType === type && styles.selectedAccountTypeButton
              ]}
              onPress={() => setBankAccountType(type)}
            >
              <Text style={[
                styles.accountTypeText,
                bankAccountType === type && styles.selectedAccountTypeText
              ]}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  currencySymbol: {
    paddingLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 12,
  },
  numericInput: {
    textAlign: 'right',
  },
  accountTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accountTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  selectedAccountTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  accountTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedAccountTypeText: {
    color: colors.white,
  },
});

export default BankAccountScreen;