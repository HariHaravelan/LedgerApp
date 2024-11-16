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
  const [isStopping, setIsStopping] = useState(false);
  
  const pulseAnim = new Animated.Value(1);
  const screenWidth = Dimensions.get('window').width;
  const silenceTimer = useRef<number | null>(null);
  const SILENCE_TIMEOUT = 2000;

  useEffect(() => {
    const setupVoice = async () => {
      try {
        await Voice.destroy();
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
    stopSilenceTimer();
    silenceTimer.current = setTimeout(() => {
      if (isRecording && !isStopping) {
        console.log('Silence detected, gracefully stopping recording');
        handleGracefulStop();
      }
    }, SILENCE_TIMEOUT) as any;
  };

  const stopSilenceTimer = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  const handleGracefulStop = async () => {
    try {
      setIsStopping(true);
      await stopVoiceRecording();
    } catch (e) {
      console.error('Error in graceful stop:', e);
    } finally {
      setIsStopping(false);
    }
  };


  const onSpeechStart = () => {
    console.log('Speech started');
    setIsRecording(true);
    setIsStopping(false);
    stopSilenceTimer();
  };

  const onSpeechEnd = async () => {
    console.log('Speech ended');
    if (!isStopping) {
      await handleGracefulStop(); // Handle the stop properly when speech ends
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      setTranscribedText(e.value[0]);
      if (!isStopping) {
        stopSilenceTimer();
        startSilenceTimer();
      }
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
    
    // Ignore client side error if we're intentionally stopping
    if (errorMessage.includes('5/Client side error') && isStopping) {
      console.log('Ignoring expected client side error during stop');
      return;
    }

    // Handle other errors
    if (!errorMessage.includes('7/No match') && 
        !errorMessage.includes('11/Didn\'t understand')) {
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
      setIsStopping(false);
      
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
    console.log('Stopping voice recording');
    try {
      stopSilenceTimer();
      await Voice.stop();
      setIsRecording(false); // Ensure this runs after Voice.stop()
    } catch (e) {
      console.error('Error stopping voice:', e);
      setError('Error stopping voice recognition');
      setIsRecording(false);
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

  const handleOverlayClose = async () => {
    try {
      setIsStopping(true);
      if (isRecording) {
        await stopVoiceRecording();
      }
      setShowOverlay(false);
      setTranscribedText('');
      setError('');
      setIsRecording(false);
    } catch (e) {
      console.error('Error in handleOverlayClose:', e);
      setShowOverlay(false);
      setTranscribedText('');
      setError('');
      setIsRecording(false);
    } finally {
      setIsStopping(false);
    }
  };

  const handleOverlayConfirm = async () => {
    try {
      setIsStopping(true);
      console.log('Processing transcribed text:', transcribedText);
      if (isRecording) {
        await stopVoiceRecording();
      }
      setShowOverlay(false);
      setTranscribedText('');
      setIsRecording(false);
    } catch (e) {
      console.error('Error in handleOverlayConfirm:', e);
      setShowOverlay(false);
      setTranscribedText('');
      setIsRecording(false);
    } finally {
      setIsStopping(false);
    }
  };

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