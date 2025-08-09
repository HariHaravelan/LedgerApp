import React from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import type { CustomDropdownProps } from "../../types/Account";

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    selected,
    options,
    isOpen,
    onToggle,
    onSelect,
    showIcons = false,
    dropdownStyle,
    containerStyle
}) => {
    const selectedOption = options.find(opt => opt.value === selected);

    return (
        <View style={containerStyle}>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <View style={styles.dropdownButtonContent}>
                    <View style={styles.selectedTypeContainer}>
                        {showIcons && selectedOption?.icon && (
                            <Icon
                                name={selectedOption.icon}
                                size={20}
                                color="#2D3142"
                                style={styles.dropdownIcon}
                            />
                        )}
                        <Text style={styles.dropdownButtonText}>
                            {selectedOption ? selectedOption.label : label}
                        </Text>
                    </View>
                    <Icon
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#2D3142"
                    />
                </View>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={onToggle}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={onToggle}
                >
                    <View style={[
                        styles.dropdownListContainer,
                        styles.dropdownListShadow,
                        dropdownStyle
                    ]}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.dropdownItem,
                                    selected === option.value && styles.selectedDropdownItem
                                ]}
                                onPress={() => {
                                    onSelect(option.value);
                                    onToggle();
                                }}
                            >
                                {showIcons && option.icon && (
                                    <Icon
                                        name={option.icon}
                                        size={20}
                                        color={selected === option.value ? '#2E5BFF' : '#2D3142'}
                                        style={styles.dropdownItemIcon}
                                    />
                                )}
                                <Text style={[
                                    styles.dropdownItemText,
                                    selected === option.value && styles.selectedDropdownItemText
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    dropdownIcon: {
        marginRight: 8,
        width: 24,
        textAlign: 'center',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#2D3142',
    },
    dropdownListContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
    },
    dropdownListShadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8ECEF',
    },
    dropdownItemIcon: {
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    selectedDropdownItem: {
        backgroundColor: '#F0F4FF',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#2D3142',
    },
    selectedDropdownItemText: {
        color: '#2E5BFF',
        fontWeight: '500',
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8ECEF',
        marginTop: 4,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-start',
        paddingTop: Platform.OS === 'ios' ? 100 : 60,
        paddingHorizontal: 16,
    },
    dropdownButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8ECEF',
    },
    dropdownButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    }, selectedTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
