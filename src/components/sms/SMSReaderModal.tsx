import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface SMSReaderModalProps {
  visible: boolean;
  onClose: () => void;
  onRead: (days: number) => Promise<void>;
}

const periods = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
];

export const SMSReaderModal: React.FC<SMSReaderModalProps> = ({
  visible,
  onClose,
  onRead,
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [isReading, setIsReading] = useState(false);

  const handleRead = async () => {
    try {
      setIsReading(true);
      await onRead(selectedDays);
    } finally {
      setIsReading(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Read Bank SMS</Text>
            <TouchableOpacity 
              onPress={onClose}
              disabled={isReading}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {!isReading ? (
            <View style={styles.content}>
              <Text style={styles.description}>
                Select the period for which you want to read bank SMS messages:
              </Text>
              
              <View style={styles.periodList}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period.value}
                    style={[
                      styles.periodItem,
                      selectedDays === period.value && styles.periodItemSelected
                    ]}
                    onPress={() => setSelectedDays(period.value)}
                  >
                    <View style={styles.periodItemContent}>
                      <Icon 
                        name="calendar-outline" 
                        size={20} 
                        color={selectedDays === period.value ? colors.primary : colors.textLight} 
                      />
                      <Text style={[
                        styles.periodText,
                        selectedDays === period.value && styles.periodTextSelected
                      ]}>
                        {period.label}
                      </Text>
                    </View>
                    {selectedDays === period.value && (
                      <Icon name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.readButton}
                onPress={handleRead}
              >
                <Text style={styles.readButtonText}>Read Messages</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Reading SMS messages...</Text>
              <Text style={styles.loadingSubtext}>Please wait while we process your messages</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 12,
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
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  periodList: {
    gap: 8,
    marginBottom: 20,
  },
  periodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  periodItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  periodItemSelected: {
    backgroundColor: `${colors.primary}08`,
    borderColor: colors.primary,
  },
  periodText: {
    fontSize: 15,
    color: colors.text,
  },
  periodTextSelected: {
    color: colors.text,
    fontWeight: '500',
  },
  readButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  readButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContent: {
    padding: 24,
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