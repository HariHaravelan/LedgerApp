// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import AddCategoryScreen from '../category/AddCategoryScreen';
import AddAccountScreen from '../account/AddAccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SetupWizardScreen from './setup/SetupWizardScreen';
const SETUP_COMPLETED_KEY = '@ledger_setup_completed';

const SettingsScreen = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  
  const resetSetup = async () => {
    try {
      await AsyncStorage.removeItem(SETUP_COMPLETED_KEY);
      setShowSetupWizard(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to reset setup');
    }
  };

  const handleSetupComplete = async () => {
    try {
      await AsyncStorage.setItem(SETUP_COMPLETED_KEY, 'true');
      setShowSetupWizard(false);
    } catch (error) {
      console.error('Error saving setup status:', error);
    }
  };

  const SettingSection: React.FC<{
    title: string;
    icon: string;
    children: React.ReactNode;
  }> = ({ title, icon, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={20} color={colors.textLight} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const SettingRow: React.FC<{
    label: string;
    onPress?: () => void;
    showArrow?: boolean;
    value?: string;
    icon?: string;
    iconColor?: string;
  }> = ({ label, onPress, showArrow = true, value, icon, iconColor }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        {icon && (
          <Icon 
            name={icon} 
            size={20} 
            color={iconColor || colors.textLight} 
            style={styles.settingIcon}
          />
        )}
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && (
          <Icon name="chevron-forward" size={20} color={colors.textLight} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <SettingSection title="Accounts & Categories" icon="wallet">
          <SettingRow
            label="Add Account"
            onPress={() => setShowAddAccount(true)}
            icon="card-outline"
            iconColor={colors.primary}
          />
          <SettingRow
            label="Manage Categories"
            onPress={() => setShowAddCategory(true)}
            icon="list-outline"
            iconColor="#10B981"
          />
        </SettingSection>

        <SettingSection title="General" icon="settings">
          <SettingRow label="Notifications" icon="notifications-outline" />
          <SettingRow label="Currency" value="INR" icon="cash-outline" />
          <SettingRow label="Language" value="English" icon="language-outline" />
          <SettingRow label="Date Format" value="DD/MM/YYYY" icon="calendar-outline" />
        </SettingSection>

        <SettingSection title="Data Management" icon="server">
          <SettingRow 
            label="Export Data" 
            icon="download-outline"
            iconColor="#3B82F6"
          />
          <SettingRow 
            label="Import Data" 
            icon="cloud-upload-outline"
            iconColor="#8B5CF6"
          />
          <SettingRow 
            label="Clear All Data" 
            icon="trash-outline"
            iconColor="#EF4444"
          />
        </SettingSection>

        <SettingSection title="About" icon="information-circle">
          <SettingRow label="Version" value="1.0.0" showArrow={false} />
          <SettingRow label="Terms of Service" />
          <SettingRow label="Privacy Policy" />
        </SettingSection>
         {/* Development Section - only visible in dev mode */}
         {__DEV__ && (
          <SettingSection title="Development" icon="construct">
            <SettingRow
              label="Run Setup Wizard"
              icon="reload-outline"
              iconColor="#6366F1"
              onPress={() => {
                Alert.alert(
                  'Reset Setup',
                  'This will launch the setup wizard. Continue?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Continue',
                      onPress: resetSetup,
                    },
                  ]
                );
              }}
            />
          </SettingSection>
        )}
      </ScrollView>
      {/* Add Category Modal */}
      <Modal
        visible={showAddCategory}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddCategoryScreen onClose={() => setShowAddCategory(false)} />
      </Modal>

      {/* Add Account Modal */}
      <Modal
        visible={showAddAccount}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddAccountScreen onClose={() => setShowAddAccount(false)} />
      </Modal>
      {/* Setup Wizard Modal */}
      <Modal
        visible={showSetupWizard}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SetupWizardScreen onComplete={handleSetupComplete} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 16,
    color: colors.textLight,
  },
});

export default SettingsScreen;