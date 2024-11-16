import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import WaveIndicator from './WaveIndicator';

interface TranscriptionOverlayProps {
  visible: boolean;
  text: string;
  error?: string;
  isRecording: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TranscriptionOverlay: React.FC<TranscriptionOverlayProps> = ({
  visible,
  text,
  error,
  isRecording,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    if (!text || error) return;
    onConfirm();
  };

  const handleClose = () => {
    onClose();
  };

  const handleOverlayPress = () => {
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Voice Input</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Icon name="close-outline" size={24} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              <View style={styles.waveContainer}>
                <WaveIndicator isRecording={isRecording} />
                {isRecording && (
                  <Text style={styles.listeningText}>Listening...</Text>
                )}
              </View>

              <View style={styles.transcriptionContainer}>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  <Text style={styles.transcriptionText}>
                    {text || (isRecording ? 'Speak now...' : 'Press the mic button to start')}
                  </Text>
                )}
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    (!text || !!error) && styles.confirmButtonDisabled
                  ]}
                  onPress={handleConfirm}
                  disabled={!text || !!error}
                >
                  <Text style={[
                    styles.buttonText, 
                    styles.confirmButtonText,
                    (!text || !!error) && styles.confirmButtonTextDisabled
                  ]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  waveContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  listeningText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  transcriptionContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  transcriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  confirmButtonText: {
    color: colors.white,
  },
  confirmButtonTextDisabled: {
    color: colors.textLight,
  },
});

export default TranscriptionOverlay;