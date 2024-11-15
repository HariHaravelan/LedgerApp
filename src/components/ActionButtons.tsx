// src/components/ActionButtons.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { colors } from '../constants/colors';
import TranscriptionOverlay from './audio/TranscriptionOverlay';

const ActionButtons = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState('');
  
  const pulseAnim = new Animated.Value(1);
  const screenWidth = Dimensions.get('window').width;
  const silenceTimer = useRef<number | null>(null);
  const SILENCE_TIMEOUT = 2000; // 2 seconds of silence before stopping

  useEffect(() => {
    const setupVoice = async () => {
      try {
        // Destroy any existing instance
        await Voice.destroy();
        
        // Set up the listeners
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
      } catch (e) {
        console.error('Error setting up Voice:', e);
      }
    };

    setupVoice();
    return () => {
      stopSilenceTimer();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSilenceTimer = () => {
    stopSilenceTimer(); // Clear any existing timer
    silenceTimer.current = setTimeout(() => {
      if (isRecording) {
        console.log('Silence detected, stopping recording');
        stopVoiceRecording();
      }
    }, SILENCE_TIMEOUT) as any;
  };

  const stopSilenceTimer = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  const onSpeechStart = () => {
    console.log('Speech started');
    setIsRecording(true);
    stopSilenceTimer();
  };

  const onSpeechEnd = () => {
    console.log('Speech ended');
    startSilenceTimer();
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      setTranscribedText(e.value[0]);
      stopSilenceTimer();
      startSilenceTimer();
    }
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      setTranscribedText(e.value[0]);
    }
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('Speech error:', e);
    const errorMessage = e.error?.message || 'Error occurred';
    
    if (errorMessage.includes('5/Client side error')) {
      // Attempt to restart voice recognition
      console.log('Attempting to restart voice recognition');
      Voice.destroy()
        .then(() => {
          startVoiceRecording();
        })
        .catch((err) => {
          console.error('Error restarting voice recognition:', err);
          setError('Please try again');
          setIsRecording(false);
        });
    } else if (
      !errorMessage.includes('7/No match') && 
      !errorMessage.includes('11/Didn\'t understand')
    ) {
      setError(errorMessage);
      setIsRecording(false);
    }
  };

  useEffect(() => {
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
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  const requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to record transactions.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const startVoiceRecording = async () => {
    try {
      setError('');
      setTranscribedText('');
      
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setError('Microphone permission denied');
        return;
      }

      setShowOverlay(true);
      
      // Make sure Voice is destroyed before starting
      await Voice.destroy();
      await Voice.start('en-US');
      startSilenceTimer();
    } catch (e) {
      console.error('Error starting voice:', e);
      setError('Please try again');
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = async () => {
    try {
      stopSilenceTimer();
      await Voice.stop();
      setIsRecording(false);
    } catch (e) {
      console.error('Error stopping voice:', e);
      setError('Error stopping voice recognition');
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      await stopVoiceRecording();
    } else {
      await startVoiceRecording();
    }
  };

  const handleAddTransaction = () => {
    console.log('Add transaction clicked');
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
    setTranscribedText('');
    setError('');
    stopVoiceRecording();
  };

  const handleOverlayConfirm = () => {
    console.log('Processing transcribed text:', transcribedText);
    setShowOverlay(false);
    setTranscribedText('');
    stopVoiceRecording();
  };

  // Rest of the component remains the same...
  return (
    <>
      <View style={[styles.container, { width: screenWidth }]}>
        <View style={styles.content}>
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
                onPress={handleMicPress}
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

      <TranscriptionOverlay
        visible={showOverlay}
        text={transcribedText}
        onClose={handleOverlayClose}
        onConfirm={handleOverlayConfirm}
        error={error}
        isRecording={isRecording}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 100,
    backgroundColor: 'transparent',
  },
  content: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'flex-end',
  },
  fabGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  fabContainer: {
    width: 56,
    height: 56,
  },
  fab: {
    width: 56,
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