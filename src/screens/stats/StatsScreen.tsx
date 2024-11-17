// src/screens/StatsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import PieChart from '../../components/charts/PieChart';

// Add these new types and components at the top of StatsScreen.tsx
type PeriodType = 'weekly' | 'monthly' | 'annually' | 'custom';

interface PeriodOption {
  value: PeriodType;
  label: string;
  icon: string;
}

const periodOptions: PeriodOption[] = [
  { value: 'weekly', label: 'Weekly', icon: 'calendar-outline' },
  { value: 'monthly', label: 'Monthly', icon: 'calendar-outline' },
  { value: 'annually', label: 'Annually', icon: 'calendar-outline' },
  { value: 'custom', label: 'Custom', icon: 'calendar-outline' },
];

interface TransactionData {
  name: string;
  value: number;
  color: string;
  transactions: number;
  trend: number;
}

const incomeData: TransactionData[] = [
  {
    name: 'Salary',
    value: 75000,
    color: '#10B981',
    transactions: 1,
    trend: 5.2
  },
  {
    name: 'Freelance',
    value: 15000,
    color: '#3B82F6',
    transactions: 3,
    trend: -2.1
  },
  {
    name: 'Investments',
    value: 10000,
    color: '#6366F1',
    transactions: 4,
    trend: 12.5
  },
  {
    name: 'Other',
    value: 5000,
    color: '#8B5CF6',
    transactions: 2,
    trend: 0
  },
];

const expenseData: TransactionData[] = [
  {
    name: 'Rent',
    value: 25000,
    color: '#EF4444',
    transactions: 1,
    trend: 0
  },
  {
    name: 'Food',
    value: 12000,
    color: '#F59E0B',
    transactions: 15,
    trend: 8.3
  },
  {
    name: 'Transport',
    value: 8000,
    color: '#EC4899',
    transactions: 22,
    trend: -5.7
  },
  {
    name: 'Shopping',
    value: 15000,
    color: '#8B5CF6',
    transactions: 8,
    trend: 15.2
  },
  {
    name: 'Bills',
    value: 10000,
    color: '#6366F1',
    transactions: 5,
    trend: 2.1
  },
];

const PeriodDropdown: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (period: PeriodType) => void;
  selectedPeriod: PeriodType;
}> = ({ visible, onClose, onSelect, selectedPeriod }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dropdownContainer}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>Select View</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color={colors.textLight} />
                </TouchableOpacity>
              </View>
              {periodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownOption,
                    selectedPeriod === option.value && styles.dropdownOptionSelected
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                >
                  <Icon
                    name={option.icon}
                    size={20}
                    color={selectedPeriod === option.value ? colors.primary : colors.text}
                  />
                  <Text style={[
                    styles.dropdownOptionText,
                    selectedPeriod === option.value && styles.dropdownOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {selectedPeriod === option.value && (
                    <Icon
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const StatsScreen: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'income' | 'expense'>('income');
  const [periodType, setPeriodType] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [tabAnimation] = useState(new Animated.Value(0));
  const [tabContainerWidth, setTabContainerWidth] = useState(0);

  useEffect(() => {
    Animated.timing(tabAnimation, {
      toValue: activeChart === 'income' ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [activeChart]);

  const formatAmount = (amount: number): string => {
    const absAmount = Math.abs(amount);
    let numStr = absAmount.toString();
    let lastThree = numStr.substring(numStr.length - 3);
    let otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `₹${formatted}`;
  };

  const changePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (periodType === 'month') {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    } else {
      if (direction === 'prev') {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
    }
    setCurrentDate(newDate);
  };

  const getTotal = (data: TransactionData[]) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  // Add these components inside StatsScreen.tsx
  const MonthSelector: React.FC<{
    currentDate: Date;
    onChange: (direction: 'prev' | 'next') => void;
  }> = ({ currentDate, onChange }) => {
    const formatMonth = (date: Date) => {
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    return (
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.monthNavButton}
          onPress={() => onChange('prev')}
        >
          <Icon name="chevron-back" size={20} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {formatMonth(currentDate)}
        </Text>

        <TouchableOpacity
          style={styles.monthNavButton}
          onPress={() => onChange('next')}
        >
          <Icon name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };
  const renderTabs = () => {
    const translateX = tabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, tabContainerWidth / 2], // Use actual pixel values
    });
  
    return (
      <View 
        style={styles.tabContainer}
        onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
      >
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={[styles.tab, activeChart === 'income' && styles.activeTab]}
            onPress={() => setActiveChart('income')}
          >
            <Text style={[
              styles.tabText,
              activeChart === 'income' && styles.activeTabText
            ]}>
              Income
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeChart === 'expense' && styles.activeTab]}
            onPress={() => setActiveChart('expense')}
          >
            <Text style={[
              styles.tabText,
              activeChart === 'expense' && styles.activeTabText
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabIndicatorContainer}>
          <Animated.View 
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX }],
                width: tabContainerWidth / 2,
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  // Update the renderPieChart function
  const renderPieChart = () => {
    const data = activeChart === 'income' ? incomeData : expenseData;
    const total = getTotal(data);

    const chartData = data.map(item => ({
      name: item.name,
      value: item.value,
      color: item.color,
    }));

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartContent}>
          <View style={styles.chartSection}>
            <PieChart
              data={chartData}
              totalAmount={formatAmount(total)}
              label={`Total ${activeChart}`}
            />
          </View>

          <View style={styles.legendContainer}>
            {data.map((item, index) => (
              <View key={item.name} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <View style={styles.legendTextSection}>
                  <Text style={styles.legendLabel} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.legendValues}>
                    <Text style={styles.legendPercentage}>
                      {((item.value / total) * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Total row at the bottom */}
        <View style={styles.divider} />
      </View>
    );
  };

  const renderTransactionRow = (item: TransactionData) => (
    <View key={item.name} style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <Text style={styles.rowName} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      
      <View style={styles.rowRight}>
        <Text style={styles.rowAmount} numberOfLines={1}>
          {formatAmount(item.value)}
        </Text>
        <Text style={styles.rowPercentage}>
          {((item.value / getTotal(activeChart === 'income' ? incomeData : expenseData)) * 100).toFixed(0)}%
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Period Selector */}
      <View style={styles.navigationBar}>
        <View style={styles.navigationTop}>
          <MonthSelector
            currentDate={currentDate}
            onChange={changePeriod}
          />
          <TouchableOpacity
            style={styles.periodButton}
            onPress={() => setShowPeriodDropdown(true)}
          >
            <Icon
              name={periodOptions.find(o => o.value === selectedPeriod)?.icon || 'calendar-outline'}
              size={20}
              color={colors.primary}
            />
            <Text style={styles.periodButtonText}>
              {periodOptions.find(o => o.value === selectedPeriod)?.label || 'View'}
            </Text>
            <Icon name="chevron-down" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {renderTabs()}
      </View>


      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderPieChart()}

          {/* Categories Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Text style={styles.sectionSubtitle}>
              {activeChart === 'income' ? incomeData.length : expenseData.length} categories
            </Text>
          </View>

          {/* Categories List */}
          <View style={styles.list}>
            {(activeChart === 'income' ? incomeData : expenseData).map(renderTransactionRow)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0, // Important for text truncation
    marginRight: 12,
  },
  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    flexShrink: 0, // Prevent dot from shrinking
  },
  rowName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    minWidth: 0, // Important for text truncation
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0, // Prevent right section from shrinking
    gap: 12,
    width: 140, // Fixed width for the right section
    justifyContent: 'flex-end',
  },
  rowAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    width: 90, // Fixed width for amount
  },
  rowPercentage: {
    fontSize: 12,
    color: colors.textLight,
    width: 35, // Fixed width for percentage
    textAlign: 'right',
  },
  tabContainer: {
    marginTop: 8,
  },
  tabWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabIndicatorContainer: {
    height: 2,
    backgroundColor: colors.border,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  tabIndicatorInner: {
    width: '50%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  // Update navigationBar style
  navigationBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navigationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chartContainer: {
    backgroundColor: colors.white,
    paddingTop: 16,
    paddingBottom: 8,
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  chartSection: {
    // For the pie chart
    width: 160,
  },
  legendContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  legendTextSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLabel: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  legendValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendAmount: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'right',
  },
  legendPercentage: {
    fontSize: 12,
    color: colors.textLight,
    width: 35,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  legendDetails: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  monthNavButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 8,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  periodButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  dropdownOptionSelected: {
    backgroundColor: `${colors.primary}10`,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  dropdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownCheckmark: {
    marginLeft: 8,
  },
  // Update periodTextContainer to show it's pressable
  periodTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
    minWidth: 120,
    justifyContent: 'center',
  },
  periodText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  periodDropdownIcon: {
    marginLeft: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  periodNavButton: {
    padding: 8,
  },
  chartSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectorTextActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  list: {
    backgroundColor: colors.white,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default StatsScreen;