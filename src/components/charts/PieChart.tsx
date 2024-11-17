// src/components/charts/PieChart.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { colors } from '../../constants/colors';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: ChartData[];
  totalAmount: string;
  label: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, totalAmount, label }) => {
  const size = 160;
  const radius = 60; // Slightly smaller radius for better visibility
  const centerX = size / 2;
  const centerY = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const createPieSegment = (startAngle: number, percentage: number, color: string) => {
    const angle = (percentage * 360);
    const endAngle = startAngle + angle;
    
    // Convert angles to radians for calculations
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    // Calculate points
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    // Create arc flag
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Generate path
    const d = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return <Path d={d} fill={color} />;
  };

  let currentAngle = 0;
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {data.map((item, index) => {
            const percentage = item.value / total;
            const segment = createPieSegment(currentAngle, percentage, item.color);
            currentAngle += percentage * 360;
            return <G key={index}>{segment}</G>;
          })}
        </G>
        {/* Add center white circle for donut effect */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={40} // Inner circle radius
          fill="white"
          {...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            },
            android: {
              elevation: 2,
            },
          })}
        />
      </Svg>
      <View style={styles.centerContent}>
        <Text style={styles.totalAmount}>{totalAmount}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: colors.textLight,
    textTransform: 'capitalize',
  },
});

export default PieChart;