import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';
import { TabType } from '../constants/types';

interface BottomBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => onTabChange('transactions')}
      >
        <Icon 
          name={activeTab === 'transactions' ? 'list-circle' : 'list-circle-outline'} 
          size={24} 
          color={activeTab === 'transactions' ? colors.gradientStart : colors.textLight} 
        />
        <Text style={[
          styles.tabText,
          activeTab === 'transactions' && styles.activeTabText
        ]}>
          Transactions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => onTabChange('accounts')}
      >
        <Icon 
          name={activeTab === 'accounts' ? 'wallet' : 'wallet-outline'} 
          size={24} 
          color={activeTab === 'accounts' ? colors.gradientStart : colors.textLight} 
        />
        <Text style={[
          styles.tabText,
          activeTab === 'accounts' && styles.activeTabText
        ]}>
          Accounts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => onTabChange('settings')}
      >
        <Icon 
          name={activeTab === 'settings' ? 'settings' : 'settings-outline'} 
          size={24} 
          color={activeTab === 'settings' ? colors.gradientStart : colors.textLight} 
        />
        <Text style={[
          styles.tabText,
          activeTab === 'settings' && styles.activeTabText
        ]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.gradientStart,
  },
});