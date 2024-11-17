// src/screens/StatsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import PieChart from '../../components/charts/PieChart';
import { expenseData, incomeData, periodOptions } from '../../data/StatsData';
import { PeriodType, TransactionData } from '../../types/Stats';
import { PeriodSelector } from '../../components/stats/PeriodSelector';
import { PeriodDropdown } from '../../components/stats/PeriodDropdown';
import { ChartTabs } from '../../components/stats/ChartTabs';
import { TransactionsList } from '../../components/stats/TransactionsList';

const StatsScreen: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'income' | 'expenses'>('income');
  const [periodType, setPeriodType] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [tabAnimation] = useState(new Animated.Value(0));
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const currentData = activeChart === 'income' ? incomeData : expenseData;
  const totalAmount = currentData.reduce((sum, item) => sum + item.value, 0);
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

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <View style={styles.navigationTop}>
          <PeriodSelector
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

        <ChartTabs
          activeChart={activeChart}
          onTabChange={setActiveChart}
          tabAnimation={tabAnimation}
          tabContainerWidth={tabContainerWidth}
          onLayout={setTabContainerWidth}
        />
      </View>


      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>

          {/*  renderPieChart()*/}
          <PieChart data={currentData} totalAmount={formatAmount(getTotal(currentData))} label={`Total ${activeChart}`} />

          {/* Categories List */}
          <TransactionsList
            data={currentData}
            totalAmount={totalAmount}
          />
        </View>
      </ScrollView>

      <PeriodDropdown
        visible={showPeriodDropdown}
        selectedPeriod={selectedPeriod}
        onClose={() => setShowPeriodDropdown(false)}
        onSelect={(period) => {
          setSelectedPeriod(period);
          setShowPeriodDropdown(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
  }, scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
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
});

export default StatsScreen;