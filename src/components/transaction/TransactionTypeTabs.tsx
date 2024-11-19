// src/components/TransactionTypeTabs.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { themeColors } from '../../constants/colors';

export type TransactionType = 'expense' | 'income' | 'transfer';

interface TransactionTypeTabsProps {
  selectedType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export const TransactionTypeTabs: React.FC<TransactionTypeTabsProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const [tabContainerWidth, setTabContainerWidth] = React.useState(0);
  const [tabAnimation] = React.useState(new Animated.Value(
    selectedType === 'expense' ? 0 : selectedType === 'income' ? 1 : 2
  ));

  React.useEffect(() => {
    Animated.timing(tabAnimation, {
      toValue: selectedType === 'expense' ? 0 : selectedType === 'income' ? 1 : 2,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [selectedType]);

  return (
    <View 
      style={styles.tabContainer}
      onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.tabWrapper}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedType === 'expense' && styles.activeTab
          ]}
          onPress={() => onTypeChange('expense')}
        >
          <Text style={[
            styles.tabText,
            selectedType === 'expense' && styles.activeTabText
          ]}>
            Expense
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedType === 'income' && styles.activeTab
          ]}
          onPress={() => onTypeChange('income')}
        >
          <Text style={[
            styles.tabText,
            selectedType === 'income' && styles.activeTabText
          ]}>
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedType === 'transfer' && styles.activeTab
          ]}
          onPress={() => onTypeChange('transfer')}
        >
          <Text style={[
            styles.tabText,
            selectedType === 'transfer' && styles.activeTabText
          ]}>
            Transfer
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.tabIndicator,
          {
            transform: [{ 
              translateX: tabAnimation.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, tabContainerWidth / 3, (tabContainerWidth / 3) * 2],
              })
            }],
            width: tabContainerWidth / 3,
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: themeColors.white,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
  },
  tabWrapper: {
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: themeColors.primaryFaded,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: themeColors.textLight,
    letterSpacing: 0.1,
  },
  activeTabText: {
    color: themeColors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    height: 2,
    backgroundColor: themeColors.primary,
  },
});

export default TransactionTypeTabs;