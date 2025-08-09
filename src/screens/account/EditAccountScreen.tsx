import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';
import Header from '../../components/Header';
import AccountForm from '../../components/forms/AccountForm';
import type { Account, AccountFormData } from '../../types/Account';

interface EditAccountScreenProps {
  onClose: () => void;
  account: Account;
  onUpdate: (accountData: any) => void;
}


const EditAccountScreen: React.FC<EditAccountScreenProps> = ({
  onClose,
  account,
  onUpdate
}) => {

  const handleSubmit = (formData: AccountFormData) => {
    // Handle updating account
  };

  // Form state
  const [formData, setFormData] = useState<AccountFormData>({
    typeId: '',
    subtypeId:'',
    name: '',
    balance: '',
    notes: '',
  });

  useEffect(() => {
    if (account) {
      const transformedData = convertAccountToFormData(account);
      setFormData(transformedData);
    }
  }, [account]);

  const convertAccountToFormData = (account: Account): AccountFormData => {
    
    const formData: AccountFormData = {
        typeId: account.type.id,
        subtypeId: account.subType.id,
        name: account.name,
        balance: account.balance.toString(),
        notes: account.notes || ''
    };
    
    return formData;
};
  return (
    <View style={styles.container}>
      <Header
        title="Edit Account"
        onClose={onClose}
      />
      <AccountForm
        formData={formData}
        onSubmit={handleSubmit}
        onChange={setFormData} 
      />
    </View>
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

export default EditAccountScreen;
