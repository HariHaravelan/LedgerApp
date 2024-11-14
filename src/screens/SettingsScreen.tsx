import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddAccountScreen from './AddAccountScreen';
import { colors } from '../constants/colors';

const SettingsScreen = () => {
  const [isAddAccountVisible, setIsAddAccountVisible] = useState(false);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setIsAddAccountVisible(true)}
          >
            <View style={styles.settingContent}>
              <Icon name="wallet-outline" size={24} color={colors.primary} />
              <Text style={styles.settingText}>Add Account</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isAddAccountVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddAccountScreen onClose={() => setIsAddAccountVisible(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
  },
});

export default SettingsScreen;