// src/screens/StatsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../../constants/colors';

const incomeData = [
  { name: 'Salary', value: 75000, color: '#10B981', legendFontColor: '#2D3142' },
  { name: 'Freelance', value: 15000, color: '#3B82F6', legendFontColor: '#2D3142' },
  { name: 'Investments', value: 10000, color: '#6366F1', legendFontColor: '#2D3142' },
  { name: 'Other', value: 5000, color: '#8B5CF6', legendFontColor: '#2D3142' },
];

const expenseData = [
  { name: 'Rent', value: 25000, color: '#EF4444', legendFontColor: '#2D3142' },
  { name: 'Food', value: 12000, color: '#F59E0B', legendFontColor: '#2D3142' },
  { name: 'Transport', value: 8000, color: '#EC4899', legendFontColor: '#2D3142' },
  { name: 'Shopping', value: 15000, color: '#8B5CF6', legendFontColor: '#2D3142' },
  { name: 'Bills', value: 10000, color: '#6366F1', legendFontColor: '#2D3142' },
];

const formatAmount = (amount: number): string => {
  const absAmount = Math.abs(amount);
  let numStr = absAmount.toString();
  let lastThree = numStr.substring(numStr.length - 3);
  let otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `₹${formatted}`;
};

const StatsScreen = () => {
  const [activeChart, setActiveChart] = useState<'income' | 'expense'>('income');
  const screenWidth = Dimensions.get('window').width;

  const getTotal = (data: typeof incomeData) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  const chartData = (activeChart === 'income' ? incomeData : expenseData).map(item => ({
    name: item.name,
    population: item.value,
    color: item.color,
    legendFontColor: item.legendFontColor,
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartSelector}>
        <TouchableOpacity
          style={[styles.selectorButton, activeChart === 'income' && styles.selectorButtonActive]}
          onPress={() => setActiveChart('income')}
        >
          <Text style={[styles.selectorText, activeChart === 'income' && styles.selectorTextActive]}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectorButton, activeChart === 'expense' && styles.selectorButtonActive]}
          onPress={() => setActiveChart('expense')}
        >
          <Text style={[styles.selectorText, activeChart === 'expense' && styles.selectorTextActive]}>
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        </View>

        <View style={styles.legendContainer}>
          {(activeChart === 'income' ? incomeData : expenseData).map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>{item.name}</Text>
                <Text style={styles.legendValue}>
                  {formatAmount(item.value)} 
                  ({((item.value / getTotal(activeChart === 'income' ? incomeData : expenseData)) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            Total {activeChart === 'income' ? 'Income' : 'Expense'}
          </Text>
          <Text style={[styles.totalValue, { color: activeChart === 'income' ? '#10B981' : '#EF4444' }]}>
            {formatAmount(getTotal(activeChart === 'income' ? incomeData : expenseData))}
          </Text>
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
  chartSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
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
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectorTextActive: {
    color: colors.white,
  },
  content: {
    padding: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  legendContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  totalContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default StatsScreen;