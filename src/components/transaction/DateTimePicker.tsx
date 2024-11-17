import DateTimePickerNative from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface DateTimePickerProps {
    date: Date;
    onDateChange: (date: Date) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ date, onDateChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            newDate.setHours(date.getHours(), date.getMinutes());
            onDateChange(newDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            onDateChange(newDate);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-UK', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <View>
            <View style={styles.dateTimeButton}>
                <TouchableOpacity
                    style={styles.dateTimeContent}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Icon name="calendar-outline" size={20} color={colors.primary} />
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dateTimeContent}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Icon name="time-outline" size={20} color={colors.primary} />
                    <Text style={styles.timeText}>{formatTime(date)}</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePickerNative
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePickerNative
                    value={date}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
};
// Styling for all components...
const styles = StyleSheet.create({
    dateTimeButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: colors.background,
    },
    dateTimeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateText: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    timeText: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
});
