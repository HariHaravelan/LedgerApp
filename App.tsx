// App.tsx
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Header from './src/components/Header';
import BottomBar from './src/components/BottomBar';
import TransactionsScreen from './src/screens/transaction/TransactionsScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import StatsScreen from './src/screens/stats/StatsScreen';
import { colors } from './src/constants/colors';
import AccountsScreen from './src/screens/account/AccountScreen';

type TabType = 'transactions' | 'accounts' | 'stats' | 'settings';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');

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