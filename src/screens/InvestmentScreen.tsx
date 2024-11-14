// src/screens/InvestmentScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { colors } from '../constants/colors';

interface InvestmentScreenProps {
  investmentName: string;
  setInvestmentName: (name: string) => void;
  investedAmount: string;
  setInvestedAmount: (amount: string) => void;
}

const InvestmentScreen: React.FC<InvestmentScreenProps> = ({
  investmentName,
  setInvestmentName,
  investedAmount,
  setInvestedAmount,
}) => {
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

  return (
    <View style={styles.container}>
      {renderInputField('Name', investmentName, setInvestmentName, 'default', 'Enter investment name')}
      {renderInputField('Amount Invested', investedAmount, setInvestedAmount, 'numeric', '0.00')}
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
  input: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
  },
});

export default InvestmentScreen;