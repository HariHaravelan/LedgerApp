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
  Modal,
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ACCOUNT_SUBTYPES, ACCOUNT_TYPE_OPTIONS } from '../../data/AccountsData';


type AccountSubType = typeof ACCOUNT_SUBTYPES[MainAccountType][number]['value'];

// Custom Dropdown Component


const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  label, 
  selected, 
  options,
  isOpen,
  onToggle,
  onSelect,
  showIcons = false,
  dropdownStyle,
  containerStyle
}) => {
  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.dropdownButtonContent}>
          <View style={styles.selectedTypeContainer}>
            {showIcons && selectedOption?.icon && (
              <Icon 
                name={selectedOption.icon}
                size={20}
                color="#2D3142"
                style={styles.dropdownIcon}
              />
            )}
            <Text style={styles.dropdownButtonText}>
              {selectedOption ? selectedOption.label : label}
            </Text>
          </View>
          <Icon 
            name={isOpen ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#2D3142" 
          />
        </View>
      </TouchableOpacity>
      
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={onToggle}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={onToggle}
        >
          <View style={[
            styles.dropdownListContainer,
            styles.dropdownListShadow,
            dropdownStyle
          ]}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  selected === option.value && styles.selectedDropdownItem
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onToggle();
                }}
              >
                {showIcons && option.icon && (
                  <Icon 
                    name={option.icon}
                    size={20}
                    color={selected === option.value ? '#2E5BFF' : '#2D3142'}
                    style={styles.dropdownItemIcon}
                  />
                )}
                <Text style={[
                  styles.dropdownItemText,
                  selected === option.value && styles.selectedDropdownItemText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

// Main Component
interface AddAccountScreenProps {
  onClose: () => void;
}

const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ onClose }) => {
  const [mainType, setMainType] = useState<MainAccountType>('bank');
  const [isMainTypeOpen, setIsMainTypeOpen] = useState(false);
  const [subType, setSubType] = useState<AccountSubType | ''>('');
  const [isSubTypeOpen, setIsSubTypeOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [balance, setBalance] = useState('');
  const [notes, setNotes] = useState('');
  
  // Additional states for specific account types
  const [interestRate, setInterestRate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  const getBalanceLabel = () => {
    switch (mainType) {
      case 'loan':
        return 'Outstanding Amount';
      case 'investment':
        return 'Invested Amount';
      case 'card':
        return subType === 'credit' ? 'Current Outstanding' : 'Available Balance';
      default:
        return 'Current Balance';
    }
  };

  const renderAdditionalFields = () => {
    switch (mainType) {
      case 'investment':
        if (['fd', 'rd', 'bonds'].includes(subType)) {
          return (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.input}
                  value={interestRate}
                  onChangeText={setInterestRate}
                  keyboardType="numeric"
                  placeholder="Enter interest rate"
                  placeholderTextColor="#8E8E93"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Maturity Date (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={maturityDate}
                  onChangeText={setMaturityDate}
                  placeholder="MM/YYYY"
                  placeholderTextColor="#8E8E93"
                />
              </View>
            </>
          );
        }
        return null;
      
      case 'card':
        if (subType === 'credit') {
          return (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Credit Limit</Text>
              <TextInput
                style={styles.input}
                value={creditLimit}
                onChangeText={setCreditLimit}
                keyboardType="numeric"
                placeholder="Enter credit limit"
                placeholderTextColor="#8E8E93"
              />
            </View>
          );
        }
        return null;
      
      case 'loan':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Interest Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
              placeholder="Enter interest rate"
              placeholderTextColor="#8E8E93"
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close-outline" size={24} color="#2D3142" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Account</Text>
        <TouchableOpacity 
          onPress={onClose}
          style={[
            styles.saveButton,
            (!nickname || !balance) && styles.saveButtonDisabled
          ]}
          disabled={!nickname || !balance}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Type</Text>
          <CustomDropdown
            label="Select Account Type"
            selected={mainType}
            options={ACCOUNT_TYPE_OPTIONS}
            isOpen={isMainTypeOpen}
            onToggle={() => {
              setIsMainTypeOpen(!isMainTypeOpen);
              setIsSubTypeOpen(false);
            }}
            onSelect={(value) => {
              setMainType(value as MainAccountType);
              setSubType(''); // Reset subtype when main type changes
            }}
            showIcons
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Subtype</Text>
          <CustomDropdown
            label="Select Account Subtype"
            selected={subType}
            options={ACCOUNT_SUBTYPES[mainType]}
            isOpen={isSubTypeOpen}
            onToggle={() => {
              setIsSubTypeOpen(!isSubTypeOpen);
              setIsMainTypeOpen(false);
            }}
            onSelect={(value) => setSubType(value as AccountSubType)}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Nickname *</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="E.g., Personal Savings, Emergency Fund"
              placeholderTextColor="#8E8E93"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{getBalanceLabel()} *</Text>
            <TextInput
              style={styles.input}
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#8E8E93"
            />
          </View>

          {renderAdditionalFields()}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes"
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#F8FAFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECEF'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3142'
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  saveButtonDisabled: {
    opacity: 0.5
  },
  saveButtonText: {
    color: '#2E5BFF',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 12
  },
  mainTypeContainer: {
    flexDirection: 'row',
    gap: 8
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8ECEF',
    backgroundColor: '#fff'
  },
  selectedTypeButton: {
    backgroundColor: '#2E5BFF',
    borderColor: '#2E5BFF'
  },
  typeIcon: {
    marginRight: 6
  },
  typeButtonText: {
    color: '#2D3142',
    fontWeight: '500'
  },
  selectedTypeButtonText: {
    color: '#fff'
  },
  subTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  subTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8ECEF'
  },
  selectedSubTypeButton: {
    backgroundColor: '#2E5BFF',
    borderColor: '#2E5BFF'
  },
  subTypeText: {
    color: '#2D3142',
    fontWeight: '500'
  },
  selectedSubTypeText: {
    color: '#fff'
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D3142'
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 100 : 60,
    paddingHorizontal: 16,
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8ECEF',
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  selectedTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginRight: 8,
    width: 24,
    textAlign: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2D3142',
  },
  dropdownListContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  dropdownListShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECEF',
  },
  dropdownItemIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  selectedDropdownItem: {
    backgroundColor: '#F0F4FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#2D3142',
  },
  selectedDropdownItemText: {
    color: '#2E5BFF',
    fontWeight: '500',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8ECEF',
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default AddAccountScreen;