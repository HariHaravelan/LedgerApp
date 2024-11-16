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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from '@react-native-voice/voice';
import { colors } from '../constants/colors';
import TranscriptionOverlay from './audio/TranscriptionOverlay';
import AddTransactionScreen from '../screens/transaction/AddTransactionScreen';
import { delay } from '../utils/time';

const ActionButtons = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState('');
  const [isStopping, setIsStopping] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const pulseAnim = new Animated.Value(1);
  const screenWidth = Dimensions.get('window').width;
  const silenceTimer = useRef<number | null>(null);
  const SILENCE_TIMEOUT = 2000;
  const MIN_RECORDING_DURATION = 500; 

  // Add these new refs to track state
  const isInitialized = useRef(false);
  const isProcessing = useRef(false);
  const lastStartTime = useRef(0);
  const listenerSetup = useRef(false);
  useEffect(() => {
    // If listeners are already set up, skip
    if (listenerSetup.current) {
      console.log('Listeners already set up, skipping');
      return;
    }

    console.log('Setting up Voice listeners');
    
    const setupListeners = async () => {
      try {
        // First destroy any existing instance
        await Voice.destroy();
        // Remove all existing listeners
        await Voice.removeAllListeners();
        
        // Create the event handler references
        const speechStartHandler = (e: SpeechStartEvent) => {
          console.log('Speech started event');
          if (!isProcessing.current) {
            setIsRecording(true);
            stopSilenceTimer();
          }
        };

        const speechEndHandler = (e: SpeechEndEvent) => {
          console.log('Speech ended event');
          if (isRecording) {
            startSilenceTimer();
          }
        };

        const speechResultsHandler = (e: SpeechResultsEvent) => {
          if (e.value && e.value[0]) {
            setTranscribedText(e.value[0]);
          }
        };
        
        const speechErrorHandler = (e: SpeechErrorEvent) => {
          console.log('Speech error:', e);
          const errorMessage = e.error?.message || 'Error occurred';
          
          // Don't restart on common errors
          if (errorMessage.includes('7/No match') || 
              errorMessage.includes('11/Didn\'t understand')) {
            // These are normal "no speech detected" errors, ignore them
            return;
          }
          
          if (errorMessage.includes('5/Client side error')) {
            // Only attempt restart if we're still supposed to be recording
            if (isRecording) {
              console.log('Attempting single restart of voice recognition');
              Voice.destroy()
                .then(() => {
                  startVoiceRecording();
                })
                .catch((err) => {
                  console.error('Error restarting voice recognition:', err);
                  setError('Please try again');
                  setIsRecording(false);
                  stopVoiceRecording();
                });
            }
          } else {
            // For other errors, stop recording
            setError(errorMessage);
            setIsRecording(false);
            stopVoiceRecording();
          }
        };
        

        const speechPartialResultsHandler = (e: SpeechResultsEvent) => {
          if (e.value && e.value[0]) {
            setTranscribedText(e.value[0]);
            stopSilenceTimer();
            startSilenceTimer();
          }
        };

        // Set up new listeners
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;
        Voice.onSpeechPartialResults = speechPartialResultsHandler;

        listenerSetup.current = true;
      } catch (error) {
        console.error('Error setting up voice listeners:', error);
      }
    };

    setupListeners();

    // Cleanup function
    return () => {
      console.log('Cleaning up Voice listeners');
      listenerSetup.current = false;
      Voice.destroy()
        .then(() => Voice.removeAllListeners())
        .catch(console.error);
    };
  }, []);

  useEffect(() => {
    console.log('Recording state changed:', isRecording);
  }, [isRecording]);

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

  const startVoiceRecording = async (retryCount = 0) => {
    if (isProcessing.current) {
      console.log('Already processing, skipping start');
      return;
    }
    
    try {
      isProcessing.current = true;
      setError('');
      setTranscribedText('');
      
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setError('Microphone permission denied');
        return;
      }

      // Set overlay state before starting voice
      setShowOverlay(true);
      // Wait for overlay to be shown
      await delay(100);
      
      lastStartTime.current = Date.now();
      await Voice.start('en-US');
      startSilenceTimer();
    } catch (e) {
      console.error('Error starting voice:', e);
      if (retryCount < 2) {
        await delay(1000);
        isProcessing.current = false;
        return startVoiceRecording(retryCount + 1);
      }
      setError('Please try again');
      setIsRecording(false);
      setShowOverlay(false); // Make sure to hide overlay on error
    } finally {
      isProcessing.current = false;
    }
  };

  const stopVoiceRecording = async () => {
    try {
      stopSilenceTimer();
      setIsRecording(false); // Set this first to prevent restart loops
      await Voice.stop();
      console.log('Voice recording stopped successfully');
    } catch (e) {
      console.error('Error stopping voice:', e);
      setError('Error stopping voice recognition');
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      await stopVoiceRecording();
    } else {
      setError(''); // Clear any previous errors
      await startVoiceRecording();
    }
  };

  const handleAddTransaction = () => {
    setShowAddTransaction(true);
  };

  const handleOverlayClose = async () => {
    console.log('Overlay closing');
    await stopVoiceRecording();
    setShowOverlay(false);
    setTranscribedText('');
    setError('');
  };

  const handleOverlayConfirm = async () => {
    console.log('Overlay confirming');
    await stopVoiceRecording();
    console.log('Processing transcribed text:', transcribedText);
    setShowOverlay(false);
    setTranscribedText('');
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
      <Modal
        visible={showAddTransaction}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddTransactionScreen onClose={() => setShowAddTransaction(false)} />
      </Modal>
     <TranscriptionOverlay
  visible={showOverlay}
  text={transcribedText}
  onClose={handleOverlayClose}
  onConfirm={handleOverlayConfirm}
  onStop={stopVoiceRecording}  // Add this line
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