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
                <Icon name="arrow-back" size={20} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section with Title */}
          <View style={styles.centerSection}>
            <Icon 
              name="wallet-outline" 
              size={18} 
              color={colors.text}
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
    backgroundColor: colors.white,
  },
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 44,
  },
  leftSection: {
    width: 60,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  rightSection: {
    width: 60,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: `${colors.text}08`,
  },
  titleIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.5,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: `${colors.primary}10`,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Header;