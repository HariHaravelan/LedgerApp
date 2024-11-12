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
} from 'react-native';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

type AccountType = 'bank' | 'cash' | 'credit' | 'investment';

interface AccountTypeOption {
  type: AccountType;
  icon: string;
  label: string;
}

const accountTypes: AccountTypeOption[] = [
  { type: 'bank', icon: 'business-outline', label: 'Bank' },
  { type: 'cash', icon: 'cash-outline', label: 'Cash' },
  { type: 'credit', icon: 'card-outline', label: 'Credit' },
  { type: 'investment', icon: 'trending-up-outline', label: 'Investment' },
];

export const AddAccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<AccountType>('bank');
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState('');

  const handleSave = () => {
    // Handle saving account
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        {/* Account Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Type</Text>
          <View style={styles.typeContainer}>
            {accountTypes.map((type) => (
              <TouchableOpacity
                key={type.type}
                style={[
                  styles.typeOption,
                  selectedType === type.type && styles.selectedType,
                ]}
                onPress={() => setSelectedType(type.type)}
              >
                <Icon
                  name={type.icon}
                  size={24}
                  color={selectedType === type.type ? colors.white : colors.text}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === type.type && styles.selectedTypeLabel,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Name</Text>
            <TextInput
              style={styles.input}
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Enter account name"
              placeholderTextColor={colors.textLight}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Initial Balance</Text>
            <TextInput
              style={styles.input}
              value={balance}
              onChangeText={setBalance}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textLight}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
    marginLeft: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  selectedType: {
    backgroundColor: colors.gradientStart,
  },
  typeLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
  },
  selectedTypeLabel: {
    color: colors.white,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.gradientStart,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});