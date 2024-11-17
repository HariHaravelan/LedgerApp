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
  const radius = 60;
  const centerX = size / 2;
  const centerY = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const createPieSegment = (startAngle: number, percentage: number, color: string) => {
    const angle = (percentage * 360);
    const endAngle = startAngle + angle;

    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

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
    <View style={styles.chartContent}>
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
          <Circle
            cx={centerX}
            cy={centerY}
            r={40}
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

      <View style={styles.legendContainer}>
        {data.map((item) => (
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
  );
};

const styles = StyleSheet.create({
  chartContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
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
  legendContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginLeft: 20,
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
    marginRight: 20,
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
});

export default PieChart;