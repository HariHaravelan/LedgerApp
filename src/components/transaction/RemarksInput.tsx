import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

interface RemarksInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const RemarksInput: React.FC<RemarksInputProps> = ({ value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.remarksContainer}>
            <View style={[
                styles.remarksInputContainer,
                isFocused && styles.remarksInputContainerFocused
            ]}>
                <Icon
                    name="create-outline"
                    size={20}
                    color={isFocused ? colors.primary : colors.textLight}
                    style={styles.remarksIcon}
                />
                <TextInput
                    style={styles.remarksInput}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Add remarks"
                    placeholderTextColor={colors.textLight}
                    multiline
                    numberOfLines={Platform.OS === 'ios' ? undefined : 3}
                    maxLength={100}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
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
            <Text style={styles.charCount}>
                {value.length}/100
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    // Amount Input Styles
    container: {
        marginBottom: 10,
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
