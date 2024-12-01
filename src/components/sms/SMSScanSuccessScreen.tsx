import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';

const SMSScanSuccessScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Navigate to the Transactions screen
    navigation.navigate('Transactions' as never);
  };

  return (
    <View style={styles.container}>
    
      <Text style={styles.heading}>Transactions Imported Successfully!</Text>
      <Text style={styles.message}>
        The transactions from your SMS messages have been extracted and 
        added to your expense tracker. You can now review, edit and categorize them.
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue to Transactions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.success,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default SMSScanSuccessScreen;