// src/screens/StatsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

// Sample data with more detailed structure
interface TransactionData {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  transactions: number;
  trend: number; // Percentage change from previous period
}

const incomeData: TransactionData[] = [
  { 
    name: 'Salary', 
    value: 75000, 
    color: '#10B981', 
    legendFontColor: '#2D3142',
    transactions: 1,
    trend: 5.2
  },
  { 
    name: 'Freelance', 
    value: 15000, 
    color: '#3B82F6', 
    legendFontColor: '#2D3142',
    transactions: 3,
    trend: -2.1
  },
  { 
    name: 'Investments', 
    value: 10000, 
    color: '#6366F1', 
    legendFontColor: '#2D3142',
    transactions: 4,
    trend: 12.5
  },
  { 
    name: 'Other', 
    value: 5000, 
    color: '#8B5CF6', 
    legendFontColor: '#2D3142',
    transactions: 2,
    trend: 0
  },
];

const expenseData: TransactionData[] = [
  { 
    name: 'Rent', 
    value: 25000, 
    color: '#EF4444', 
    legendFontColor: '#2D3142',
    transactions: 1,
    trend: 0
  },
  { 
    name: 'Food', 
    value: 12000, 
    color: '#F59E0B', 
    legendFontColor: '#2D3142',
    transactions: 15,
    trend: 8.3
  },
  { 
    name: 'Transport', 
    value: 8000, 
    color: '#EC4899', 
    legendFontColor: '#2D3142',
    transactions: 22,
    trend: -5.7
  },
  { 
    name: 'Shopping', 
    value: 15000, 
    color: '#8B5CF6', 
    legendFontColor: '#2D3142',
    transactions: 8,
    trend: 15.2
  },
  { 
    name: 'Bills', 
    value: 10000, 
    color: '#6366F1', 
    legendFontColor: '#2D3142',
    transactions: 5,
    trend: 2.1
  },
];

const StatsScreen = () => {
  const [activeChart, setActiveChart] = useState<'income' | 'expense'>('expense');
  const [periodType, setPeriodType] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const screenWidth = Dimensions.get('window').width;

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

  const formatPeriod = (date: Date) => {
    if (periodType === 'month') {
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }
    return date.getFullYear().toString();
  };

  const getTotal = (data: TransactionData[]) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  const renderPieChart = () => {
    const data = activeChart === 'income' ? incomeData : expenseData;
    const total = getTotal(data);

    return (
      <View style={styles.pieChart}>
        {/* Center circle with total */}
        <View style={styles.totalCircle}>
          <Text style={styles.totalAmount}>{formatAmount(total)}</Text>
          <Text style={styles.totalLabel}>Total {activeChart}</Text>
        </View>
        
        {/* Render pie segments */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const rotation = index * (360 / data.length);
          
          return (
            <View
              key={item.name}
              style={[
                styles.pieSegment,
                {
                  backgroundColor: item.color,
                  transform: [
                    { rotate: `${rotation}deg` },
                    { scale: percentage / 100 }
                  ]
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderCategoryCard = (item: TransactionData) => (
    <View key={item.name} style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.transactionCount}>
          {item.transactions} {item.transactions === 1 ? 'transaction' : 'transactions'}
        </Text>
      </View>
      
      <View style={styles.categoryDetails}>
        <View>
          <Text style={styles.categoryAmount}>{formatAmount(item.value)}</Text>
          <Text style={styles.categoryPercentage}>
            {((item.value / getTotal(activeChart === 'income' ? incomeData : expenseData)) * 100).toFixed(1)}%
          </Text>
        </View>
        
        <View style={[
          styles.trendContainer,
          { backgroundColor: item.trend > 0 ? '#10B98110' : item.trend < 0 ? '#EF444410' : '#94A3B810' }
        ]}>
          <Icon
            name={item.trend > 0 ? 'trending-up' : item.trend < 0 ? 'trending-down' : 'remove'}
            size={16}
            color={item.trend > 0 ? '#10B981' : item.trend < 0 ? '#EF4444' : '#94A3B8'}
          />
          <Text style={[
            styles.trendText,
            { color: item.trend > 0 ? '#10B981' : item.trend < 0 ? '#EF4444' : '#94A3B8' }
          ]}>
            {Math.abs(item.trend)}%
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Period Selector */}
      <View style={styles.navigationBar}>
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={styles.periodNavButton}
            onPress={() => changePeriod('prev')}
          >
            <Icon name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.periodTextContainer}
            onPress={() => setPeriodType(periodType === 'month' ? 'year' : 'month')}
          >
            <Text style={styles.periodText}>{formatPeriod(currentDate)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.periodNavButton}
            onPress={() => changePeriod('next')}
          >
            <Icon name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.chartSelector}>
          <TouchableOpacity
            style={[styles.selectorButton, activeChart === 'expense' && styles.selectorButtonActive]}
            onPress={() => setActiveChart('expense')}
          >
            <Text style={[styles.selectorText, activeChart === 'expense' && styles.selectorTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectorButton, activeChart === 'income' && styles.selectorButtonActive]}
            onPress={() => setActiveChart('income')}
          >
            <Text style={[styles.selectorText, activeChart === 'income' && styles.selectorTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chartContainer}>
          {renderPieChart()}
        </View>

        <View style={styles.categoriesContainer}>
          {(activeChart === 'income' ? incomeData : expenseData).map(renderCategoryCard)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navigationBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
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
  periodTextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
  },
  periodText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
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
  chartContainer: {
    padding: 16,
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  pieChart: {
    width: 240,
    height: 240,
    borderRadius: 120,
    position: 'relative',
    backgroundColor: colors.background,
  },
  pieSegment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    borderRadius: 120,
  },
  totalCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  categoriesContainer: {
    padding: 16,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  transactionCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: colors.textLight,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StatsScreen;