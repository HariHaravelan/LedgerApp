import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../constants/colors';

interface AddTransactionScreenProps {
  onClose: () => void;
}

// Sample data - In real app, these would come from your data store
const accounts = [
  'HDFC Debit Card',
  'HDFC Credit Card',
  'HDFC Savings',
  'SBI Credit Card',
  'Amazon Pay',
  'Paytm Wallet',
];

const categories = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Investment',
  'Salary',
  'Rent',
];

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ onClose }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [account, setAccount] = useState(accounts[0]);
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Preserve the existing time when changing date
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours(), date.getMinutes());
      setDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Preserve the existing date when changing time
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!amount) {
      // Handle validation error
      return;
    }

    const transaction = {
      date: date.toISOString(),
      account,
      category,
      amount: parseFloat(amount),
      remarks,
    };

    console.log('New transaction:', transaction);
    onClose();
  };

  const handleContinue = () => {
    handleSubmit();
    // Additional continue logic here
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPicker = (
    isVisible: boolean,
    values: string[],
    selectedValue: string,
    onValueChange: (value: string) => void,
    onClose: () => void
  ) => {
    if (!isVisible) return null;

    if (Platform.OS === 'ios') {
      return (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.pickerDoneButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
          >
            {values.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
        </View>
      );
    }

    return (
      <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => {
          onValueChange(value);
          onClose();
        }}
      >
        {values.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close-outline" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleContinue} style={[styles.headerButton, styles.continueButton]}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={[styles.headerButton, styles.saveButton]}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.form}>
        {/* Date and Time Fields */}
        <View style={styles.dateTimeContainer}>
          {/* Date Field */}
          <View style={[styles.field, styles.dateField]}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.inputText}>{formatDate(date)}</Text>
            </TouchableOpacity>
          </View>

          {/* Time Field */}
          <View style={[styles.field, styles.timeField]}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.inputText}>{formatTime(date)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Rest of the form fields */}
        <View style={styles.field}>
          <Text style={styles.label}>Account</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowAccountPicker(true)}
          >
            <Text style={styles.inputText}>{account}</Text>
          </TouchableOpacity>
        </View>

        {renderPicker(
          showAccountPicker,
          accounts,
          account,
          setAccount,
          () => setShowAccountPicker(false)
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={styles.inputText}>{category}</Text>
          </TouchableOpacity>
        </View>

        {renderPicker(
          showCategoryPicker,
          categories,
          category,
          setCategory,
          () => setShowCategoryPicker(false)
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.textInput]}
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.input, styles.textInput, styles.remarksInput]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
            placeholderTextColor={colors.textLight}
            multiline
          />
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
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  continueButton: {
    backgroundColor: colors.background,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  continueButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateField: {
    flex: 3,
    marginBottom: 0,
  },
  timeField: {
    flex: 2,
    marginBottom: 0,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: colors.text,
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    padding: 12,
  },
  remarksInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerDoneButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTransactionScreen;