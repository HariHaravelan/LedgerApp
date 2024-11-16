import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

interface HeaderProps {
  title?: string;
  onClose?: () => void;
  onSave?: () => void;
  saveDisabled?: boolean;
  onMonthChange?: (date: Date) => void;
  onReadSMS?: () => void;
  onSearch?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "Expense Manager",
  onClose,
  onSave,
  saveDisabled = false,
  onMonthChange,
  onReadSMS,
  onSearch,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  const formatMonth = (date: Date) => {
    // Get abbreviated month name (3 chars) and last 2 digits of year
    const month = date.toLocaleString('default', { month: 'short' }); // Gets 3-letter month
    const year = date.getFullYear().toString().slice(-2); // Gets last 2 digits of year
    return `${month} '${year}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main Header */}
      <View style={styles.container}>
        <View style={styles.headerContent}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {onClose && (
              <TouchableOpacity
                onPress={onClose}
                style={styles.iconButton}
              >
                <Icon name="arrow-back" size={22} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section with Title */}
          <View style={styles.centerSection}>
            <Icon 
              name="wallet-outline" 
              size={22} 
              color={colors.white}
              style={styles.titleIcon} 
            />
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {onSave && (
              <TouchableOpacity
                onPress={onSave}
                disabled={saveDisabled}
                style={[
                  styles.saveButton,
                  saveDisabled && styles.saveButtonDisabled
                ]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
            {!onSave && <View style={styles.iconButton} />}
          </View>
        </View>
      </View>

      {/* Sub Header with Actions */}
      <View style={styles.subHeaderContainer}>
        <View style={styles.subHeader}>
          <View style={styles.monthSelector}>
            <TouchableOpacity 
              style={styles.monthNavButton}
              onPress={() => changeMonth('prev')}
            >
              <Icon name="chevron-back" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <View style={styles.monthTextContainer}>
              <Text style={styles.monthText}>{formatMonth(currentDate)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.monthNavButton}
              onPress={() => changeMonth('next')}
            >
              <Icon name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onSearch}
            >
              <Icon name="search-outline" size={18} color={colors.primary} />
              <Text style={styles.actionButtonText}>Find</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onReadSMS}
            >
              <Icon name="mail-unread-outline" size={18} color={colors.primary} />
              <Text style={styles.actionButtonText}>SMS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  container: {
    backgroundColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  leftSection: {
    width: 70,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightSection: {
    width: 70,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  saveButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  saveButtonDisabled: {
    opacity: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  // Sub Header Styles with New Theme
  subHeaderContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Reduced from 8
    backgroundColor: colors.background,
    paddingHorizontal: 6, // Reduced from 8
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthNavButton: {
    padding: 4,
  },
  monthTextContainer: {
    minWidth: 80, // Reduced from 120
    alignItems: 'center',
  },
  monthText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Reduced from 12
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10, // Reduced from 12
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default Header;