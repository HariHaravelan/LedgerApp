import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type TabType = 'transactions' | 'accounts' | 'settings';

interface BottomBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => onTabChange('transactions')}
      >
        <Icon 
          name={activeTab === 'transactions' ? 'list-circle' : 'list-circle-outline'} 
          size={24} 
          color={activeTab === 'transactions' ? '#2E5BFF' : '#8E8E93'} 
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
          color={activeTab === 'accounts' ? '#2E5BFF' : '#8E8E93'} 
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
          color={activeTab === 'settings' ? '#2E5BFF' : '#8E8E93'} 
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8ECEF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
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
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#2E5BFF',
  },
});

export default BottomBar;