// AddAccountScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface AddAccountScreenProps {
  onClose: () => void;
}

type AccountType = 'bank' | 'investment' | 'credit';
type BankAccountType = 'savings' | 'current' | 'fd' | 'rd';

const AccountTypeButton: React.FC<{
  type: AccountType;
  selected: boolean;
  onSelect: (type: AccountType) => void;
  label: string;
}> = ({ type, selected, onSelect, label }) => (
  <TouchableOpacity
    style={[styles.typeButton, selected && styles.selectedTypeButton]}
    onPress={() => onSelect(type)}
  >
    <Icon 
      name={
        type === 'bank' 
          ? 'wallet-outline' 
          : type === 'investment' 
            ? 'trending-up-outline'
            : 'card-outline'
      } 
      size={20} 
      color={selected ? colors.white : colors.text}
      style={styles.typeIcon}
    />
    <Text style={[styles.typeButtonText, selected && styles.selectedTypeButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ onClose }) => {
  const [accountType, setAccountType] = useState<AccountType>('bank');
  
  // Bank Account fields
  const [bankName, setBankName] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [bankAccountType, setBankAccountType] = useState<BankAccountType>('savings');
  
  // Credit Card fields
  const [cardName, setCardName] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  
  // Investment fields
  const [investmentName, setInvestmentName] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');

  const handleSave = () => {
    let accountData = {};
    
    switch (accountType) {
      case 'bank':
        accountData = {
          type: 'bank',
          name: bankName,
          balance: parseFloat(bankBalance) || 0,
          accountType: bankAccountType,
        };
        break;
      case 'credit':
        accountData = {
          type: 'credit',
          name: cardName,
          outstandingAmount: parseFloat(outstandingAmount) || 0,
        };
        break;
      case 'investment':
        accountData = {
          type: 'investment',
          name: investmentName,
          amountInvested: parseFloat(investedAmount) || 0,
        };
        break;
    }
    
    console.log('Saving account:', accountData);
    onClose();
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    keyboardType: 'default' | 'numeric' = 'default',
    placeholder: string = ''
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} *</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
      />
    </View>
  );

  const renderBankFields = () => (
    <>
      {renderInputField('Account Name', bankName, setBankName, 'default', 'Enter account name')}
      {renderInputField('Balance', bankBalance, setBankBalance, 'numeric', '0.00')}
      
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
    </>
  );

  const renderCreditFields = () => (
    <>
      {renderInputField('Name', cardName, setCardName, 'default', 'Enter card name')}
      {renderInputField('Outstanding Unbilled', outstandingAmount, setOutstandingAmount, 'numeric', '0.00')}
    </>
  );

  const renderInvestmentFields = () => (
    <>
      {renderInputField('Name', investmentName, setInvestmentName, 'default', 'Enter investment name')}
      {renderInputField('Amount Invested', investedAmount, setInvestedAmount, 'numeric', '0.00')}
    </>
  );

  const isFormValid = () => {
    switch (accountType) {
      case 'bank':
        return bankName && bankBalance;
      case 'credit':
        return cardName && outstandingAmount;
      case 'investment':
        return investmentName && investedAmount;
      default:
        return false;
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Account</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.saveButton}
          disabled={!isFormValid()}
        >
          <Text style={[styles.saveButtonText, !isFormValid() && styles.saveButtonDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.typeButtonsContainer}>
              <AccountTypeButton
                type="bank"
                selected={accountType === 'bank'}
                onSelect={setAccountType}
                label="Bank Account"
              />
              <AccountTypeButton
                type="credit"
                selected={accountType === 'credit'}
                onSelect={setAccountType}
                label="Credit Card"
              />
              <AccountTypeButton
                type="investment"
                selected={accountType === 'investment'}
                onSelect={setAccountType}
                label="Investment"
              />
            </View>
          </View>

          {accountType === 'bank' && renderBankFields()}
          {accountType === 'credit' && renderCreditFields()}
          {accountType === 'investment' && renderInvestmentFields()}
        </View>

        <Text style={styles.requiredText}>* Required fields</Text>
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
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  typeIcon: {
    marginRight: 6,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeButtonText: {
    color: colors.white,
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
  requiredText: {
    color: colors.textLight,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
});

export default AddAccountScreen;