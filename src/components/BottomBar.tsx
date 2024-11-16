import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

type TabType = 'transactions' | 'accounts' | 'stats' | 'settings';

interface BottomBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabChange }) => {
  const TabButton = ({ 
    tab, 
    icon, 
    label 
  }: { 
    tab: TabType; 
    icon: string;
    label: string;
  }) => (
    <TouchableOpacity
      style={styles.tab}
      onPress={() => onTabChange(tab)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        activeTab === tab && styles.activeIconContainer
      ]}>
        <Icon
          name={activeTab === tab ? icon : `${icon}-outline`}
          size={22}  // Reduced from 24
          color={activeTab === tab ? colors.primary : colors.textSecondary}
        />
      </View>
      <Text style={[
        styles.tabLabel,
        activeTab === tab && styles.activeTabLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TabButton
          tab="transactions"
          icon="list-circle"
          label="Transactions"
        />
        <TabButton
          tab="accounts"
          icon="wallet"
          label="Accounts"
        />
        <TabButton
          tab="stats"
          icon="pie-chart"
          label="Stats"
        />
        <TabButton
          tab="settings"
          icon="settings"
          label="Settings"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,  // Reduced from 48
    height: 44, // Reduced from 48
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  activeIconContainer: {
    backgroundColor: `${colors.primary}10`,
  },
  tabLabel: {
    fontSize: 11,  // Reduced from 12
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
});

export default BottomBar;