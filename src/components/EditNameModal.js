import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export default function EditNameModal({
  visible,
  currentName,
  onSave,
  onCancel,
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (visible) {
      setName(currentName || '');
    }
  }, [visible, currentName]);

  function handleSave() {
    if (name.trim() && name.trim() !== currentName) {
      const trimmedName = name.trim();
      setName('');
      onSave(trimmedName);
    }
  }

  function handleDismiss() {
    setName('');
    onCancel();
  }

  const canSave = name.trim() && name.trim() !== currentName;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Edit Plant Name</Text>
              <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Plant nickname"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                !canSave && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#14532D',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 20,
    color: '#666666',
  },
  input: {
    fontFamily: 'Nunito_400Regular',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#1B4332',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#2D6A4F',
  },
  saveButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});
