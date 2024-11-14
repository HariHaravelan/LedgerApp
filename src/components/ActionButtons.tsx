// src/components/ActionButtons.tsx
import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing,
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

const ActionButtons = () => {
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = new Animated.Value(1);
  const screenWidth = Dimensions.get('window').width;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleAddTransaction = () => {
    console.log('Add transaction clicked');
  };

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={styles.content}>
        {isRecording && (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="camera-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="close-outline" size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.fabGroup}>
          <TouchableOpacity
            style={[styles.fab, styles.addFab]}
            onPress={handleAddTransaction}
            activeOpacity={0.8}
          >
            <Icon name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <Animated.View style={[
            styles.fabContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <TouchableOpacity
              style={[
                styles.fab,
                isRecording && styles.fabRecording
              ]}
              onPress={() => setIsRecording(!isRecording)}
              activeOpacity={0.8}
            >
              <Icon
                name={isRecording ? 'mic' : 'mic-outline'}
                size={32}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 100, // Height for FABs + padding
    backgroundColor: 'transparent',
  },
  content: {
    position: 'absolute',
    right: 16,
    bottom: 16, // Adjust this value to control distance from bottom bar
    alignItems: 'flex-end',
  },
  quickActions: {
    marginBottom: 16,
  },
  quickActionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  fabContainer: {
    width: 56, // Slightly smaller
    height: 56,
  },
  fab: {
    width: 56, // Slightly smaller
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addFab: {
    backgroundColor: '#10B981',
  },
  fabRecording: {
    backgroundColor: '#FF3B30',
  },
});

export default ActionButtons;