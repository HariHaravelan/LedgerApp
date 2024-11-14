// src/components/VoiceInputFAB.tsx
import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

const VoiceInputFAB = () => {
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = new Animated.Value(1);

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

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Positioned above the BottomBar
    right: 16,
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
  fabContainer: {
    width: 64,
    height: 64,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabRecording: {
    backgroundColor: '#FF3B30',
  },
});

export default VoiceInputFAB;