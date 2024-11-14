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
import { colors } from '../../constants/colors';

// Sample data - you'll want to replace this with real data
const incomeData = [
  { name: 'Salary', value: 75000, color: '#10B981' },
  { name: 'Freelance', value: 15000, color: '#3B82F6' },
  { name: 'Investments', value: 10000, color: '#6366F1' },
  { name: 'Other', value: 5000, color: '#8B5CF6' },
];

const expenseData = [
  { name: 'Rent', value: 25000, color: '#EF4444' },
  { name: 'Food', value: 12000, color: '#F59E0B' },
  { name: 'Transport', value: 8000, color: '#EC4899' },
  { name: 'Shopping', value: 15000, color: '#8B5CF6' },
  { name: 'Bills', value: 10000, color: '#6366F1' },
];

type ChartType = 'income' | 'expense';

const StatsScreen = () => {
  const [activeChart, setActiveChart] = useState<ChartType>('income');
  const windowWidth = Dimensions.get('window').width;
  const chartSize = windowWidth - 48; // Leaving some padding

  const getTotal = (data: typeof incomeData) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  // Calculate percentages and angles for the pie chart
  const calculatePieSegments = (data: typeof incomeData) => {
    const total = getTotal(data);
    let startAngle = 0;
    
    return data.map(item => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 2 * Math.PI;
      const segment = {
        ...item,
        percentage,
        startAngle,
        endAngle: startAngle + angle,
      };
      startAngle += angle;
      return segment;
    });
  };

  // Create SVG path for a pie segment
  const createPiePath = (
    segment: ReturnType<typeof calculatePieSegments>[0],
    size: number,
    padding: number = 0
  ) => {
    const radius = (size / 2) - padding;
    const centerX = size / 2;
    const centerY = size / 2;

    const startX = centerX + radius * Math.cos(segment.startAngle);
    const startY = centerY + radius * Math.sin(segment.startAngle);
    const endX = centerX + radius * Math.cos(segment.endAngle);
    const endY = centerY + radius * Math.sin(segment.endAngle);

    const largeArcFlag = segment.endAngle - segment.startAngle > Math.PI ? 1 : 0;

    return `
      M ${centerX} ${centerY}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
  };

  const formatAmount = (amount: number) => {
    // return new Intl.NumberFormat('en-IN', {
    //   style: 'currency',
    //   currency: 'INR',
    //   maximumFractionDigits: 0,
    // }).format(amount);
    return amount;
  };

  return (
    <View style={styles.container}>
      {/* Chart Type Selector */}
      <View style={styles.chartSelector}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            activeChart === 'income' && styles.selectorButtonActive
          ]}
          onPress={() => setActiveChart('income')}
        >
          <Text style={[
            styles.selectorText,
            activeChart === 'income' && styles.selectorTextActive
          ]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            activeChart === 'expense' && styles.selectorButtonActive
          ]}
          onPress={() => setActiveChart('expense')}
        >
          <Text style={[
            styles.selectorText,
            activeChart === 'expense' && styles.selectorTextActive
          ]}>Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
            {calculatePieSegments(activeChart === 'income' ? incomeData : expenseData)
              .map((segment, index) => (
                <path
                  key={index}
                  d={createPiePath(segment, chartSize, 4)}
                  fill={segment.color}
                />
            ))}
          </svg>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {(activeChart === 'income' ? incomeData : expenseData).map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>{item.name}</Text>
                <Text style={styles.legendValue}>
                  {formatAmount(item.value)} ({((item.value / getTotal(activeChart === 'income' ? incomeData : expenseData)) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total {activeChart === 'income' ? 'Income' : 'Expense'}</Text>
          <Text style={[
            styles.totalValue,
            { color: activeChart === 'income' ? '#10B981' : '#EF4444' }
          ]}>
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