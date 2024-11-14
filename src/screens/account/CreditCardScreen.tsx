// src/screens/CreditCardScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { colors } from '../constants/colors';

interface CreditCardScreenProps {
  cardName: string;
  setCardName: (name: string) => void;
  outstandingAmount: string;
  setOutstandingAmount: (amount: string) => void;
}

const CreditCardScreen: React.FC<CreditCardScreenProps> = ({
  cardName,
  setCardName,
  outstandingAmount,
  setOutstandingAmount,
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
      {renderInputField('Name', cardName, setCardName, 'default', 'Enter card name')}
      {renderInputField('Outstanding Unbilled', outstandingAmount, setOutstandingAmount, 'numeric', '0.00')}
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

export default CreditCardScreen;