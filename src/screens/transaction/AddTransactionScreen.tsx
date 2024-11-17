// src/screens/AddTransactionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../constants/colors';

interface Props {
  onClose: () => void;
}
const CATEGORIES = {
  expense: [
    { id: '1', name: 'Food & Dining', icon: 'restaurant' },
    { id: '2', name: 'Shopping', icon: 'cart' },
    { id: '3', name: 'Transport', icon: 'car' },
    { id: '4', name: 'Entertainment', icon: 'film' },
    { id: '5', name: 'Bills', icon: 'receipt' },
    { id: '6', name: 'Health', icon: 'medical' },
    { id: '7', name: 'Education', icon: 'school' },
    { id: '8', name: 'Others', icon: 'ellipsis-horizontal' },
  ],
  income: [
    { id: '9', name: 'Salary', icon: 'cash' },
    { id: '10', name: 'Investment', icon: 'trending-up' },
    { id: '11', name: 'Business', icon: 'briefcase' },
    { id: '12', name: 'Others', icon: 'ellipsis-horizontal' },
  ],
};

const ACCOUNTS = [
  { id: '1', name: 'HDFC Savings', balance: 25000, type: 'bank' },
  { id: '2', name: 'ICICI Credit Card', balance: -15000, type: 'card' },
  { id: '3', name: 'Cash Wallet', balance: 5000, type: 'wallet' },
];

const AddTransactionScreen: React.FC<Props> = ({ onClose }) => {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Preserve the time from the existing date
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours(), date.getMinutes());
      setDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Preserve the date but update the time
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const renderCategorySelector = () => (
    <TouchableOpacity
      style={styles.selectorButton}
      onPress={() => setShowCategoryModal(true)}
    >
      <View style={styles.selectorLeft}>
        <Icon name="apps-outline" size={20} color={colors.primary} />
        <Text style={styles.selectorLabel}>
          {selectedCategory ?
            CATEGORIES[type].find(c => c.id === selectedCategory)?.name :
            'Select Category'}
        </Text>
      </View>
      <Icon name="chevron-down" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  const renderAmountInput = () => (
    <View style={styles.amountContainer}>
      <Text style={styles.currencySymbol}>₹</Text>
      <TextInput
        style={styles.amountInput}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.textLight}
      />
    </View>
  );

  const renderTypeSelector = () => (
    <View style={styles.typeSelector}>
      <TouchableOpacity
        style={[styles.typeButton, type === 'expense' && styles.activeExpenseButton]}
        onPress={() => setType('expense')}
      >
        <Icon
          name="arrow-down"
          size={18}
          color={type === 'expense' ? colors.white : colors.error}
        />
        <Text style={[
          styles.typeButtonText,
          type === 'expense' && styles.activeTypeButtonText
        ]}>
          Expense
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.typeButton, type === 'income' && styles.activeIncomeButton]}
        onPress={() => setType('income')}
      >
        <Icon
          name="arrow-up"
          size={18}
          color={type === 'income' ? colors.white : colors.success}
        />
        <Text style={[
          styles.typeButtonText,
          type === 'income' && styles.activeTypeButtonText
        ]}>
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAccountSelector = () => (
    <TouchableOpacity
      style={styles.selectorButton}
      onPress={() => setShowAccountModal(true)}
    >
      <View style={styles.selectorLeft}>
        <Icon name="wallet-outline" size={20} color={colors.primary} />
        <Text style={styles.selectorLabel}>
          {selectedAccount ?
            ACCOUNTS.find(a => a.id === selectedAccount)?.name :
            'Select Account'}
        </Text>
      </View>
      <Icon name="chevron-down" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  const renderDateTimePicker = () => (
    <View>
      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => {
          if (Platform.OS === 'ios') {
            setShowDatePicker(true);
          } else {
            setShowDatePicker(true);
          }
        }}
      >
        <View style={styles.dateTimeContent}>
          <Icon name="calendar-outline" size={20} color={colors.primary} />
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>
        <TouchableOpacity
          style={styles.dateTimeContent}
          onPress={() => {
            if (Platform.OS === 'ios') {
              setShowTimePicker(true);
            } else {
              setShowTimePicker(true);
            }
          }}
        >
          <Icon name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.timeText}>{formatTime(date)}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onClose}
        >
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButton, !amount && styles.saveButtonDisabled]}
          disabled={!amount}
          onPress={() => {
            // Handle save logic
            console.log({
              type,
              date,
              account: selectedAccount,
              category: selectedCategory,
              amount,
              remarks
            });
            onClose();
          }}
        >
          <Text style={[styles.saveButtonText, !amount && styles.saveButtonTextDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Rest of your existing render methods */}
        {renderTypeSelector()}
        {renderDateTimePicker()}

        <View style={styles.form}>
          {renderAccountSelector()}
          {renderCategorySelector()}
          {renderAmountInput()}

          <TextInput
            style={styles.remarksInput}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Add remarks"
            placeholderTextColor={colors.textLight}
            multiline
          />
        </View>
      </ScrollView>

      {/* Account Selection Modal */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAccountModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Account</Text>
              <TouchableOpacity onPress={() => setShowAccountModal(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {ACCOUNTS.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedAccount(account.id);
                    setShowAccountModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{account.name}</Text>
                  {selectedAccount === account.id && (
                    <Icon name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {CATEGORIES[type].map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={styles.categoryOption}>
                    <Icon name={category.icon} size={20} color={colors.primary} />
                    <Text style={styles.modalOptionText}>{category.name}</Text>
                  </View>
                  {selectedCategory === category.id && (
                    <Icon name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: colors.border,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  saveButtonTextDisabled: {
    color: colors.textLight,
  },
  content: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  activeExpenseButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  activeIncomeButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  activeTypeButtonText: {
    color: colors.white,
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background,
  },
  dateTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  form: {
    padding: 16,
    gap: 16,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorLabel: {
    fontSize: 15,
    color: colors.text,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '500',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    color: colors.text,
    padding: 12,
  },
  remarksInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
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
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  // Date picker specific styles
  datePickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePickerButtonText: {
    fontSize: 15,
    color: colors.text,
  },
  // Additional form styles
  fieldLabel: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  // Error state styles
  errorInput: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  // Category grid styles (alternative to list)
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  categoryGridItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  categoryGridItemActive: {
    backgroundColor: `${colors.primary}10`,
    borderColor: colors.primary,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  // Quick amount buttons
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  quickAmountButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickAmountText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  // Split section styles
  splitContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  splitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  splitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitToggleText: {
    fontSize: 14,
    color: colors.primary,
  },
  // Receipt image styles
  receiptContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  receiptButton: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptIcon: {
    marginBottom: 8,
  },
  receiptText: {
    fontSize: 14,
    color: colors.textLight,
  },
  // Recurring transaction styles
  recurringContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  recurringLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recurringText: {
    fontSize: 15,
    color: colors.text,
  },
  // Bottom sheet modal styles
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  // Loading state styles
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 12,
  },
});

export default AddTransactionScreen;