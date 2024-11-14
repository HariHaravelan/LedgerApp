// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddAccountScreen from '../account/AddAccountScreen';
import ActionButtons from '../../components/ActionButtons';
import { colors } from '../../constants/colors';

type SettingGroupType = {
  title: string;
  items: {
    icon: string;
    label: string;
    onPress: () => void;
    iconColor?: string;
  }[];
};

const SettingsScreen = () => {
  const [isAddAccountVisible, setIsAddAccountVisible] = useState(false);
  const [isEditAccountVisible, setIsEditAccountVisible] = useState(false);
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [isEditCategoryVisible, setIsEditCategoryVisible] = useState(false);

  const settingsGroups: SettingGroupType[] = [
    {
      title: 'Account',
      items: [
        {
          icon: 'wallet-outline',
          label: 'Add Account',
          onPress: () => setIsAddAccountVisible(true),
          iconColor: colors.primary,
        },
        {
          icon: 'create-outline',
          label: 'Edit Account',
          onPress: () => setIsEditAccountVisible(true),
          iconColor: colors.primary,
        },
      ],
    },
    {
      title: 'Category',
      items: [
        {
          icon: 'pricetag-outline',
          label: 'Add Category',
          onPress: () => setIsAddCategoryVisible(true),
          iconColor: '#10B981', // Green color for category actions
        },
        {
          icon: 'create-outline',
          label: 'Edit Category',
          onPress: () => setIsEditCategoryVisible(true),
          iconColor: '#10B981',
        },
      ],
    },
  ];

  return (
    <>
      <ScrollView style={styles.container}>
        {settingsGroups.map((group, index) => (
          <View key={group.title} style={[styles.section, index > 0 && styles.sectionMargin]}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            <View style={styles.sectionContent}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={item.label}
                  style={[
                    styles.settingItem,
                    itemIndex < group.items.length - 1 && styles.settingItemBorder
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.settingContent}>
                    <Icon 
                      name={item.icon} 
                      size={24} 
                      color={item.iconColor || colors.primary} 
                    />
                    <Text style={styles.settingText}>{item.label}</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <ActionButtons />

      {/* Modals */}
      <Modal
        visible={isAddAccountVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddAccountScreen onClose={() => setIsAddAccountVisible(false)} />
      </Modal>
      
      {/* Add other modals as needed */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionMargin: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
  },
});

export default SettingsScreen;