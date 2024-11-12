import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Layout } from './src/components/Layout';
import { Header } from './src/components/Header';
import { BottomBar } from './src/components/BottomBar';
import { TabType } from './src/constants/types';
import { colors } from './src/constants/colors';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');

  return (
    <Layout>
      <Header />
      <View style={styles.content}>
        <Text style={styles.contentText}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Text>
      </View>
      <BottomBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  contentText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '500',
  },
});

export default App;