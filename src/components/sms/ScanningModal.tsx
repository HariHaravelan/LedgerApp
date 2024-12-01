import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface ScanningModalProps {
  visible: boolean;
}

export const ScanningModal: React.FC<ScanningModalProps> = ({ visible }) => {
  const smsIconAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // SMS icon animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(smsIconAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(smsIconAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Dots opacity animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotsOpacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(dotsOpacity, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Scanning visualization */}
          <View style={styles.scanArea}>
            <Animated.View
              style={[
                styles.smsIcon,
                {
                  transform: [
                    {
                      translateY: smsIconAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -20],
                      }),
                    },
                  ],
                  opacity: smsIconAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.5, 1],
                  }),
                },
              ]}
            >
              <Icon name="chatbubble" size={60} color={colors.primary} />
            </Animated.View>

            <Animated.View
              style={[
                styles.pulsingCircle,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0.6, 0],
                  }),
                },
              ]}
            />

            <Animated.View
              style={[
                styles.dots,
                {
                  opacity: dotsOpacity,
                },
              ]}
            >
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </Animated.View>
          </View>

          {/* Status text */}
          <View style={styles.statusContainer}>
            <Text style={styles.title}>Scanning Messages</Text>
            <Text style={styles.subtitle}>
              Please wait while we process your messages
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  scanArea: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: `${colors.primary}10`,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  smsIcon: {
    position: 'absolute',
  },
  pulsingCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  dots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: 5,
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});