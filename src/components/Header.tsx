import React from 'react';
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
}

const Header: React.FC<HeaderProps> = ({
  title = "Expense Manager",
  onClose,
  onSave,
  saveDisabled = false,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
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
});

export default Header;