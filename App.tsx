// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Header from './src/components/Header';
import BottomBar from './src/components/BottomBar';
import TransactionsScreen from './src/screens/transaction/TransactionsScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import StatsScreen from './src/screens/stats/StatsScreen';
import { colors } from './src/constants/colors';
import AccountsScreen from './src/screens/account/AccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SetupWizardScreen from './src/screens/settings/setup/SetupWizardScreen';

// Key for AsyncStorage
const SETUP_COMPLETED_KEY = '@ledger_setup_completed';

type TabType = 'transactions' | 'accounts' | 'stats' | 'settings';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const setupCompleted = await AsyncStorage.getItem(SETUP_COMPLETED_KEY);
      setNeedsSetup(!setupCompleted);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setIsLoading(false);
    }
  };

  const handleSetupComplete = async () => {
    try {
      await AsyncStorage.setItem(SETUP_COMPLETED_KEY, 'true');
      setNeedsSetup(false);
    } catch (error) {
      console.error('Error saving setup status:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* You can add a loading spinner here */}
      </View>
    );
  }

  if (needsSetup) {
    return <SetupWizardScreen onComplete={handleSetupComplete} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsScreen />;
      case 'transactions':
        return <TransactionsScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'accounts':
        return (
          <AccountsScreen />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header />
      {renderScreen()}
      <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;