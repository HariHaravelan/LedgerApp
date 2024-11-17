import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    // Format the displayed amount
    const formatDisplayAmount = useCallback((val: string) => {
        if (!val) return '';
        const num = Number(val.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return '';
        return num.toLocaleString('en-IN');
    }, []);

    // Handle amount change with proper formatting
    const handleAmountChange = (text: string) => {
        // Remove all non-numeric characters except decimal point
        const cleanedText = text.replace(/[^0-9.]/g, '');
        // Ensure only one decimal point
        const parts = cleanedText.split('.');
        const formattedText = parts.length > 2
            ? `${parts[0]}.${parts.slice(1).join('')}`
            : cleanedText;

        onChange(formattedText);
    };

    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused
            ]}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                    style={styles.input}
                    value={formatDisplayAmount(value)}
                    onChangeText={handleAmountChange}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textLight}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={12}
                    selectionColor={colors.primary}
                />
                {value !== '' && (
                    <TouchableOpacity
                        onPress={() => onChange('')}
                        style={styles.clearButton}
                    >
                        <Icon name="close-circle" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
      },
      inputContainerFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.white,
      },
      currencySymbol: {
        fontSize: 24,
        color: colors.text,
        fontWeight: '500',
        marginRight: 8,
      },
      input: {
        flex: 1,
        fontSize: 24,
        color: colors.text,
        padding: 12,
        ...Platform.select({
          ios: {
            paddingVertical: 12,
          },
          android: {
            paddingVertical: 8,
          },
        }),
      },
      clearButton: {
        padding: 4,
      },
      quickAmountContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 8,
      },
      quickAmountButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: `${colors.primary}10`,
        borderWidth: 1,
        borderColor: colors.primary,
      },
      quickAmountText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '500',
      },
    
      // Remarks Input Styles
      remarksContainer: {
        marginBottom: 16,
      },
      remarksInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
      },
      remarksInputContainerFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.white,
      },
      remarksIcon: {
        marginTop: Platform.OS === 'ios' ? 4 : 8,
        marginRight: 8,
      },
      remarksInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        maxHeight: 100,
        textAlignVertical: 'top',
        ...Platform.select({
          ios: {
            paddingTop: 0,
            paddingBottom: 0,
          },
          android: {
            paddingVertical: 4,
          },
        }),
      },
      charCount: {
        fontSize: 12,
        color: colors.textLight,
        textAlign: 'right',
        marginTop: 4,
        marginRight: 4,
      },
});