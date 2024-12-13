import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Icon name={icon} size={24} color={colors.primary} />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

export const FeaturesList: React.FC = () => (
  <View style={styles.featuresList}>
    <FeatureItem
      icon="shield-checkmark-outline"
      title="Private & Secure"
      description="Your data stays on your device"
    />
    <FeatureItem
      icon="sync-outline" 
      title="Auto Detection"
      description="Quick account setup from messages"
    />
    <FeatureItem
      icon="time-outline"
      title="Real-time Updates"
      description="Stay on top of your transactions"
    />
  </View>
);

const styles = StyleSheet.create({
  featuresList: {
    paddingHorizontal: 16,
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
});