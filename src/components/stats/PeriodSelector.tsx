import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface PeriodSelectorProps {
    currentDate: Date;
    onChange: (direction: 'prev' | 'next') => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
    currentDate,
    onChange,
}) => {
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

            <Text style={styles.monthText}>{formatMonth(currentDate)}</Text>

            <TouchableOpacity
                style={styles.monthNavButton}
                onPress={() => onChange('next')}
            >
                <Icon name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
});