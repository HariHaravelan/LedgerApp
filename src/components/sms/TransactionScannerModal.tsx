import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../constants/colors';
import { ScanningModal } from './ScanningModal';
import { SMSTransaction } from '../../types/Transaction';
import { ACCOUNTS } from '../../data/TransactionData';
import { SMSHandler } from '../../utils/SMSHandler';

interface ScannerModalProps {
    visible: boolean;
    handleScanComplete: (transactions: SMSTransaction[]) => void;
    onClose: () => void;
}

const periods = [
    { label: 'Last 7 days', value: 7, icon: 'today-outline' },
    { label: 'Last 30 days', value: 30, icon: 'calendar-outline' },
    { label: 'Custom Range', value: -1, icon: 'calendar-clear-outline' },
];

export const TransactionScannerModal: React.FC<ScannerModalProps> = ({
    visible,
    handleScanComplete,
    onClose,
}) => {
    const [selectedOption, setSelectedOption] = useState<number | 'custom'>(30);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateType, setDateType] = useState<'start' | 'end'>('start');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Scanning state
    const [isScanning, setIsScanning] = useState(false);


    const handleStartScan = async () => {
        setIsScanning(true);
      
        try {
            const transactions = await SMSHandler.readTransactions(
                startDate,
                endDate,
                ACCOUNTS
              );
          handleScanComplete(transactions);
        } finally {
          setIsScanning(false);
          onClose();
        }
      };

    const handleOptionSelect = (value: number) => {
        setSelectedOption(value);
        if (value !== -1) {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - value);
            setStartDate(start);
            setEndDate(end);
        }
    };

    const handleDateSelect = (event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (date) {
            if (dateType === 'start') {
                setStartDate(date);
            } else {
                setEndDate(date);
            }
        }
    };

    const showDateSelection = (type: 'start' | 'end') => {
        setDateType(type);
        setShowDatePicker(true);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
    };



    return (
        <>
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <View style={styles.header}>
                                <View style={styles.headerContent}>
                                    <Icon name="scan-outline" size={24} color={colors.primary} />
                                    <Text style={styles.title}>Scan Transactions</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Icon name="close" size={24} color={colors.textLight} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.content}>
                                <View style={styles.description}>
                                    <Icon name="information-circle-outline" size={20} color={colors.primary} />
                                    <Text style={styles.descriptionText}>
                                        Select a time period to scan your bank SMS messages for transactions
                                    </Text>
                                </View>

                                <View style={styles.optionList}>
                                    {periods.map((period) => (
                                        <TouchableOpacity
                                            key={period.value}
                                            style={[
                                                styles.optionItem,
                                                selectedOption === period.value && styles.optionItemSelected
                                            ]}
                                            onPress={() => handleOptionSelect(period.value)}
                                        >
                                            <View style={styles.optionContent}>
                                                <Icon
                                                    name={period.icon}
                                                    size={22}
                                                    color={selectedOption === period.value ? colors.primary : colors.textLight}
                                                />
                                                <Text style={[
                                                    styles.optionText,
                                                    selectedOption === period.value && styles.optionTextSelected
                                                ]}>
                                                    {period.label}
                                                </Text>
                                            </View>
                                            {selectedOption === period.value && (
                                                <Icon name="checkmark-circle" size={22} color={colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {selectedOption === -1 && (
                                    <View style={styles.dateRangeContainer}>
                                        <TouchableOpacity
                                            style={styles.dateButton}
                                            onPress={() => showDateSelection('start')}
                                        >
                                            <Text style={styles.dateLabel}>From</Text>
                                            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                                        </TouchableOpacity>

                                        <View style={styles.dateArrow}>
                                            <Icon name="arrow-forward" size={20} color={colors.textLight} />
                                        </View>

                                        <TouchableOpacity
                                            style={styles.dateButton}
                                            onPress={() => showDateSelection('end')}
                                        >
                                            <Text style={styles.dateLabel}>To</Text>
                                            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {showDatePicker && (Platform.OS === 'ios' ? (
                                    <View style={styles.datePickerContainer}>
                                        <DateTimePicker
                                            value={dateType === 'start' ? startDate : endDate}
                                            mode="date"
                                            display="inline"
                                            onChange={handleDateSelect}
                                            maximumDate={new Date()}
                                        />
                                        <TouchableOpacity
                                            style={styles.datePickerDone}
                                            onPress={() => setShowDatePicker(false)}
                                        >
                                            <Text style={styles.datePickerDoneText}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : Platform.OS === 'android' && (
                                    <DateTimePicker
                                        value={dateType === 'start' ? startDate : endDate}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateSelect}
                                        maximumDate={new Date()}
                                    />
                                ))}

                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={handleStartScan}
                                >
                                    <Icon name="scan" size={20} color={colors.white} />
                                    <Text style={styles.scanButtonText}>Start Scan</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <ScanningModal
                visible={isScanning}
            />
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 400,
        margin: 20,
        maxHeight: '80%', // Prevents modal from being too tall
    },
    modal: {
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.white,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    content: {
        padding: 16,
        backgroundColor: colors.white,
    },
    description: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: `${colors.primary}08`,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    descriptionText: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
    },
    optionList: {
        gap: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionItemSelected: {
        backgroundColor: `${colors.primary}08`,
        borderColor: colors.primary,
    },
    optionText: {
        fontSize: 15,
        color: colors.text,
    },
    optionTextSelected: {
        color: colors.text,
        fontWeight: '500',
    },
    dateRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 8,
    },
    dateButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    dateLabel: {
        fontSize: 12,
        color: colors.textLight,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    dateArrow: {
        padding: 8,
    },
    datePickerContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    datePickerDone: {
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    datePickerDoneText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    scanButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    scanButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContent: {
        padding: 32,
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginTop: 8,
    },
    loadingSubtext: {
        fontSize: 14,
        color: colors.textLight,
        textAlign: 'center',
    },
});