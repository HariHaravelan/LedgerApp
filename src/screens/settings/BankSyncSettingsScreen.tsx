// src/screens/BankSyncSettingsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { SMSHandler } from '../../utils/SMSHandler';


const BankSyncSettingsScreen = () => {
  const [autoSync, setAutoSync] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const handleRescan = async () => {
    try {
      setIsScanning(true);

      // Start date 6 months ago for initial scan
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      const detectedAccounts = await SMSHandler.detectAccounts();

      // TODO: Process transactions to detect unique bank accounts
      
      Alert.alert(
        'Scan Complete',
        `Found ${detectedAccounts.length} transactions`
      );

    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to scan messages. Please try again.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const confirmRescan = () => {
    Alert.alert(
      'Scan Messages',
      'This will scan your SMS messages to detect bank accounts. It may take a few moments.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start Scan',
          onPress: handleRescan,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SMS Sync Settings</Text>
        
        {/* Auto-Sync Toggle */}
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-Sync SMS</Text>
            <Text style={styles.settingDesc}>
              Automatically detect new transactions
            </Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ true: colors.primary }}
          />
        </View>

        {/* Notifications Toggle */}
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Transaction Notifications</Text>
            <Text style={styles.settingDesc}>
              Get alerts for new transactions
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: colors.primary }}
          />
        </View>

        {/* Rescan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={confirmRescan}
          disabled={isScanning}
        >
          <View style={styles.scanButtonContent}>
            <Icon
              name={isScanning ? 'sync' : 'refresh'}
              size={20}
              color={colors.primary}
              style={isScanning && styles.spinning}
            />
            <View style={styles.scanButtonText}>
              <Text style={styles.scanButtonTitle}>
                {isScanning ? 'Scanning...' : 'Rescan Messages'}
              </Text>
              <Text style={styles.scanButtonDesc}>
                Look for new bank accounts
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Icon name="information-circle-outline" size={20} color={colors.textLight} />
        <Text style={styles.infoText}>
          Bank sync uses your SMS messages to detect transactions from your bank accounts.
          No data is shared outside your device.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    color: colors.textLight,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scanButtonText: {
    marginLeft: 12,
  },
  scanButtonTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  scanButtonDesc: {
    fontSize: 13,
    color: colors.textLight,
  },
  spinning: {
    ...(Platform.OS === 'ios' ? {
      transform: [{ rotate: '360deg' }],
    } : {}),
  },
  infoSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: `${colors.primary}08`,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
});

export default BankSyncSettingsScreen;