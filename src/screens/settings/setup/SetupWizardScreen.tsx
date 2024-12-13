import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, WIZARD_COLORS } from '../../../constants/colors';
import { DetectedAccount } from '../../../types/SMSTypes';
import { SMSHandler } from '../../../utils/SMSHandler';
import { WelcomeStep } from './WelcomeStep';
import { AccountSelectionStep } from './AccountSelectionStep';
import { SuccessStep } from './SuccessStep';

interface SetupWizardScreenProps {
  onComplete: () => void;
}

const SetupWizardScreen: React.FC<SetupWizardScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  const [detectedAccounts, setDetectedAccounts] = useState<DetectedAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step - 1) / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const handleScanAccounts = async () => {
    try {
      setIsScanning(true);
      const accounts = await SMSHandler.detectAccounts();
      setDetectedAccounts(accounts);
      setSelectedAccounts(new Set(accounts.map(acc => acc.id)));
      setStep(2);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan messages. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Link Your Accounts';
      case 2: return 'Verify Your Accounts';
      case 3: return 'All Set!';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return 'We analyze your transaction messages to set up automatic tracking. Your data never leaves your device.';
      case 2:
        return 'We found these accounts in your messages. Select the ones you want to track.';
      case 3:
        return 'Your accounts are ready! You can start tracking your transactions now.';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerSection}>
        <Icon
          name="wallet-outline"
          size={18}
          color={colors.text}
          style={styles.titleIcon}
        />
        <Text style={styles.title}>Ledger</Text>
      </View>

      <View style={styles.progress}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>

      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{getStepTitle()}</Text>
        <Text style={styles.stepDescription}>{getStepDescription()}</Text>
      </View>

      {step === 1 && (
        <WelcomeStep
          onScan={handleScanAccounts}
          isScanning={isScanning}
        />
      )}
      
      {step === 2 && (
        <AccountSelectionStep
          accounts={detectedAccounts}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          onContinue={() => setStep(3)}
        />
      )}
      
      {step === 3 && (
        <SuccessStep
          selectedCount={selectedAccounts.size}
          onComplete={onComplete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.surface,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  titleIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  progress: {
    height: 4,
    backgroundColor: `${colors.primary}15`,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  stepHeader: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});

export default SetupWizardScreen;