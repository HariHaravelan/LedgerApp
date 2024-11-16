// src/screens/AddCategoryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface AddCategoryScreenProps {
  onClose: () => void;
}

// Sample data for existing categories (in a real app, this would come from your data store)
const existingCategories = {
  income: [
    { id: '1', name: 'Salary', type: 'income' },
    { id: '2', name: 'Investment', type: 'income' },
    { id: '3', name: 'Freelance', type: 'income' },
  ],
  expense: [
    { id: '4', name: 'Food', type: 'expense' },
    { id: '5', name: 'Transport', type: 'expense' },
    { id: '6', name: 'Shopping', type: 'expense' },
  ],
};

type CategoryType = 'income' | 'expense';

const TypeSelector: React.FC<{
  type: CategoryType;
  onTypeChange: (type: CategoryType) => void;
}> = ({ type, onTypeChange }) => (
  <View style={styles.typeContainer}>
    <TouchableOpacity
      style={[
        styles.typeButton,
        type === 'income' && styles.selectedTypeButton,
      ]}
      onPress={() => onTypeChange('income')}
    >
      <Icon
        name="arrow-down-circle-outline"
        size={20}
        color={type === 'income' ? colors.white : colors.text}
        style={styles.typeIcon}
      />
      <Text
        style={[
          styles.typeButtonText,
          type === 'income' && styles.selectedTypeButtonText,
        ]}
      >
        Income
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.typeButton,
        type === 'expense' && styles.selectedTypeButton,
      ]}
      onPress={() => onTypeChange('expense')}
    >
      <Icon
        name="arrow-up-circle-outline"
        size={20}
        color={type === 'expense' ? colors.white : colors.text}
        style={styles.typeIcon}
      />
      <Text
        style={[
          styles.typeButtonText,
          type === 'expense' && styles.selectedTypeButtonText,
        ]}
      >
        Expense
      </Text>
    </TouchableOpacity>
  </View>
);

const AddCategoryScreen: React.FC<AddCategoryScreenProps> = ({ onClose }) => {
  const [categoryType, setCategoryType] = useState<CategoryType>('expense');
  const [categoryName, setCategoryName] = useState('');
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const [showParentSelector, setShowParentSelector] = useState(false);

  const handleSave = () => {
    const newCategory = {
      name: categoryName,
      type: categoryType,
      parentId: isSubcategory ? selectedParentCategory : null,
    };
    
    console.log('Saving category:', newCategory);
    onClose();
  };

  const isFormValid = () => {
    if (!categoryName.trim()) return false;
    if (isSubcategory && !selectedParentCategory) return false;
    return true;
  };

  const renderParentCategorySelector = () => {
    const availableParents = existingCategories[categoryType];

    return (
      <View style={styles.parentSelectorContainer}>
        {availableParents.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.parentCategoryButton,
              selectedParentCategory === category.id && styles.selectedParentCategory,
            ]}
            onPress={() => {
              setSelectedParentCategory(category.id);
              setShowParentSelector(false);
            }}
          >
            <Text
              style={[
                styles.parentCategoryText,
                selectedParentCategory === category.id && styles.selectedParentCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
        <Text style={styles.headerText}>Add Category</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={!isFormValid()}
        >
          <Text
            style={[
              styles.saveButtonText,
              !isFormValid() && styles.saveButtonDisabled,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <TypeSelector type={categoryType} onTypeChange={setCategoryType} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Name *</Text>
            <TextInput
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Enter category name"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.subcategorySwitch}>
            <Text style={styles.label}>Make this a subcategory</Text>
            <Switch
              value={isSubcategory}
              onValueChange={setIsSubcategory}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {isSubcategory && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Parent Category *</Text>
              <TouchableOpacity
                style={styles.parentCategorySelector}
                onPress={() => setShowParentSelector(!showParentSelector)}
              >
                <Text style={styles.parentCategoryPlaceholder}>
                  {selectedParentCategory
                    ? existingCategories[categoryType].find(
                        (cat) => cat.id === selectedParentCategory
                      )?.name
                    : 'Select parent category'}
                </Text>
                <Icon
                  name={showParentSelector ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textLight}
                />
              </TouchableOpacity>

              {showParentSelector && renderParentCategorySelector()}
            </View>
          )}
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
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeIcon: {
    marginRight: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedTypeButtonText: {
    color: colors.white,
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
  subcategorySwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  parentCategorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
  },
  parentCategoryPlaceholder: {
    fontSize: 16,
    color: colors.text,
  },
  parentSelectorContainer: {
    marginTop: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
  },
  parentCategoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedParentCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  parentCategoryText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedParentCategoryText: {
    color: colors.white,
  },
  requiredText: {
    color: colors.textLight,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
});

export default AddCategoryScreen;