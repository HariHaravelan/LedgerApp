import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../constants/colors';
import { ChartType } from '../../types/Stats';

interface ChartTabsProps {
    activeChart: ChartType;
    onTabChange: (tab: ChartType) => void;
    tabAnimation: Animated.Value;
    tabContainerWidth: number;
    onLayout: (width: number) => void;
}

export const ChartTabs: React.FC<ChartTabsProps> = ({
    activeChart,
    onTabChange,
    tabAnimation,
    tabContainerWidth,
    onLayout,
}) => {
    const translateX = tabAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, tabContainerWidth / 2],
    });

    return (
        <View
            style={styles.tabContainer}
            onLayout={(e) => onLayout(e.nativeEvent.layout.width)}
        >
            <View style={styles.tabWrapper}>
                <TouchableOpacity
                    style={[styles.tab, activeChart === 'income' && styles.activeTab]}
                    onPress={() => onTabChange('income')}
                >
                    <Text style={[
                        styles.tabText,
                        activeChart === 'income' && styles.activeTabText
                    ]}>
                        Income
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeChart === 'expenses' && styles.activeTab]}
                    onPress={() => onTabChange('expenses')}
                >
                    <Text style={[
                        styles.tabText,
                        activeChart === 'expenses' && styles.activeTabText
                    ]}>
                        Expenses
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

const styles = StyleSheet.create({
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
});