import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

// First, install linear gradient:
// npm install react-native-linear-gradient

// Color palette
const colors = {
  primary: '#2E5BFF',
  primaryLight: '#ECF1FF',
  primaryFaded: '#8BA3FF',
  white: '#FFFFFF',
  background: '#F8FAFF',
  text: '#2D3142',
  textLight: '#9BA1B3',
  border: '#E8ECEF',
  // New gradient colors
  gradientStart: '#4568DC',
  gradientEnd: '#B06AB3',
};

type TabType = 'transactions' | 'accounts' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Expense Manager</Text>
          <Text style={styles.headerSubText}>Track your finances</Text>
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Text>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setActiveTab('transactions')}
        >
          <Icon 
            name={activeTab === 'transactions' ? 'list-circle' : 'list-circle-outline'} 
            size={24} 
            color={activeTab === 'transactions' ? colors.gradientStart : colors.textLight} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'transactions' && styles.activeTabText
          ]}>
            Transactions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setActiveTab('accounts')}
        >
          <Icon 
            name={activeTab === 'accounts' ? 'wallet' : 'wallet-outline'} 
            size={24} 
            color={activeTab === 'accounts' ? colors.gradientStart : colors.textLight} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'accounts' && styles.activeTabText
          ]}>
            Accounts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setActiveTab('settings')}
        >
          <Icon 
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'} 
            size={24} 
            color={activeTab === 'settings' ? colors.gradientStart : colors.textLight} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'settings' && styles.activeTabText
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50, // Account for status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
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
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.gradientStart,
  },
});

export default App;