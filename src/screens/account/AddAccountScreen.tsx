import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { colors } from '../../constants/colors';
import AccountForm from '../../components/forms/AccountForm';
import Header from '../../components/Header';


// Main Component
interface AddAccountScreenProps {
  onClose: () => void;
}

const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ onClose }) => {

  const handleSubmit = (formData: AccountFormData) => {
    // Handle creating new account
  };

  // Form state
  const [formData, setFormData] = useState<AccountFormData>({
    typeId: 0,
    subtypeId: 0,
    name: '',
    balance: '',
    notes: '',
  });

  return (
    <View style={styles.container}>
      <Header
        title="Add Account"
        onClose={onClose}
      />
      <AccountForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

});

export default AddAccountScreen;