import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, WIZARD_COLORS } from '../../../constants/colors';
import { FeaturesList } from './FeaturesList';

interface WelcomeStepProps {
  onScan: () => void;
  isScanning: boolean;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onScan, isScanning }) => (
  <View style={styles.stepContent}>
    <View style={styles.heroSection}>
      <View style={styles.iconRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${WIZARD_COLORS.accent1}15` }]}>
          <Icon name="wallet-outline" size={32} color={WIZARD_COLORS.accent1} />
        </View>
        <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}15` }]}>
          <Icon name="card-outline" size={32} color={colors.primary} />
        </View>
        <View style={[styles.iconCircle, { backgroundColor: `${WIZARD_COLORS.accent2}15` }]}>
          <Icon name="phone-portrait-outline" size={32} color={WIZARD_COLORS.accent2} />
        </View>
      </View>
    </View>

    <FeaturesList />
    
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
        onPress={onScan}
        disabled={isScanning}
      >
        <View style={styles.scanButtonContent}>
          <Icon
            name={isScanning ? 'sync' : 'search-outline'}
            size={24}
            color={colors.white}
            style={[isScanning && styles.spinningIcon]}
          />
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Detecting Accounts...' : 'Start Detection'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WIZARD_COLORS.accent1,
    padding: 18,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
    shadowColor: WIZARD_COLORS.accent1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  scanButtonDisabled: {
    opacity: 0.7,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  spinningIcon: {
    ...(Platform.OS === 'ios' ? {
      transform: [{ rotate: '360deg' }],
    } : {}),
  },
});