import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from 'react-native';
import Header from './src/components/Header';
import BottomBar from './src/components/BottomBar';
import SettingsScreen from './src/screens/SettingsScreen';

type TabType = 'transactions' | 'accounts' | 'settings';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');

  const renderScreen = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsScreen />;
      case 'transactions':
        return (
          <View style={styles.content}>
            <Text>Transactions Screen</Text>
          </View>
        );
      case 'accounts':
        return (
          <View style={styles.content}>
            <Text>Accounts Screen</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />
      <Header />
      {renderScreen()}
      <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;