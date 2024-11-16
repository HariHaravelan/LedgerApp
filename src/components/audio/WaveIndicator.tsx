import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface WaveIndicatorProps {
  isRecording: boolean;
}

const WaveIndicator: React.FC<WaveIndicatorProps> = ({ isRecording }) => {
  // Create refs for multiple waves
  const waveAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Stop all animations immediately when not recording
    if (!isRecording) {
      waveAnimations.forEach(anim => {
        anim.stopAnimation();
        anim.setValue(0);
      });
      return;
    }

    // Start animations when recording
    waveAnimations.forEach((anim, index) => {
      createWaveAnimation(anim, index * 200);
    });

    // Cleanup function
    return () => {
      waveAnimations.forEach(anim => {
        anim.stopAnimation();
      });
    };
  }, [isRecording]); // Only re-run when isRecording changes

  const createWaveAnimation = (animation: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  if (!isRecording) {
    return (
      <View style={styles.container}>
        {waveAnimations.map((_, index) => (
          <View
            key={index}
            style={[styles.wave, styles.waveStatic]}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {waveAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.wave,
            {
              transform: [
                {
                  scaleY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 1, 0.3],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 4,
  },
  wave: {
    width: 3,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  waveStatic: {
    opacity: 0.3,
    transform: [{ scaleY: 0.4 }],
  },
});

export default WaveIndicator;