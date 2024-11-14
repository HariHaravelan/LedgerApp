// src/components/Header.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

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
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
        style={styles.gradient}
      >
        <View style={styles.headerContent}>
          {/* Left Side - Back/Close Button */}
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.iconButton}
            >
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          )}

          {/* Center - Title */}
          <View style={styles.titleContainer}>
            <Icon 
              name="wallet-outline" 
              size={24} 
              color="#FFF" 
              style={styles.titleIcon} 
            />
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Right Side - Save Button */}
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
          
          {/* If no save button, we still need to maintain layout */}
          {!onSave && <View style={styles.iconButton} />}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3B82F6',
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
  gradient: {
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Header;