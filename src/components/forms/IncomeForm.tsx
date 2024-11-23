import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';
import { Account, Category } from '../../types/Transaction';
import { AmountInput } from '../transaction/AmountInput';
import { CategorySelector } from '../transaction/CategorySelector';
import { AccountSelector } from '../transaction/AccountSelector';
import { DateTimePicker } from '../transaction/DateTimePicker';
import { RemarksInput } from '../transaction/RemarksInput';

export interface IncomeFormData {
  amount: string;
  category: string;
  account: string;
  date: Date;
  remarks: string;
}

interface IncomeFormProps {
  data: IncomeFormData;
  onChange: (data: IncomeFormData) => void;
  categories: Category[];
  accounts: Account[];
  onSave: () => void;
  onSaveAndContinue: () => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({
  data,
  onChange,
  categories,
  accounts,
  onSave,
  onSaveAndContinue
}) => {
  return (
    <View style={styles.container}>
      {/* Amount Input */}
      <View style={styles.amountSection}>
        <AmountInput
          value={data.amount}
          onChange={(amount) => onChange({ ...data, amount })}
        />
      </View>

      {/* Main Form Section */}
      <View style={styles.formSection}>
        {/* Category Input */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Source</Text>
          <View style={styles.inputContainer}>
            <CategorySelector
              categories={categories}
              selectedId={data.category}
              onSelect={(id) => onChange({ ...data, category: id })}
            />
          </View>
        </View>

        {/* Account Input */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Account</Text>
          <View style={styles.inputContainer}>
            <AccountSelector
              accounts={accounts}
              selectedId={data.account}
              onSelect={(id) => onChange({ ...data, account: id })}
            />
          </View>
        </View>

        {/* Date Input */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.inputContainer}>
            <DateTimePicker
              date={data.date}
              onDateChange={(date) => onChange({ ...data, date })}
            />
          </View>
        </View>

        {/* Remarks Input - with special styling */}
        <View style={styles.remarksRow}>
          <Text style={[styles.label, styles.remarksLabel]}>Notes</Text>
          <View style={styles.remarksInputContainer}>
            <RemarksInput
              value={data.remarks}
              onChange={(remarks) => onChange({ ...data, remarks })}
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={onSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.continueButton]}
          onPress={onSaveAndContinue}
        >
          <Text style={styles.continueButtonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  amountSection: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
  },
  formSection: {
    paddingTop: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    minHeight: 48,

    borderBottomColor: colors.border,
  },
  label: {
    width: 70,
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  // Special styling for remarks section
  remarksRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 12,
    minHeight: 40, // Increased height for remarks
 
    borderBottomColor: colors.border,
  },
  remarksLabel: {
    paddingTop: 8, // Align with the input text
  },
  remarksInputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  buttonContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  continueButton: {
    backgroundColor: `${colors.primary}10`,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default IncomeForm;