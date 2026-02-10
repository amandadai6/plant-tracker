import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { usePlants } from '../context/PlantContext';

export default function AddPlantScreen() {
  const [plantName, setPlantName] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const { addPlant } = usePlants();

  async function handleAddPlant() {
    if (plantName.trim()) {
      try {
        await addPlant(plantName);
        setPlantName('');
        showMessage('success', 'Plant added!');
      } catch (error) {
        showMessage('error', 'Failed to add plant. Please try again.');
      }
    }
  }

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 2500);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {message && (
        <View
          style={[
            styles.messageContainer,
            message.type === 'success' ? styles.successMessage : styles.errorMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.type === 'success' ? styles.successText : styles.errorText,
            ]}
          >
            {message.type === 'success' ? '✓ ' : '✕ '}
            {message.text}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>Add a Plant</Text>
        <Text style={styles.subtitle}>
          Give your plant a nickname to start tracking its care.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Plant nickname (e.g., Kitchen fern)"
          value={plantName}
          onChangeText={setPlantName}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleAddPlant}
        />

        <TouchableOpacity
          style={[styles.button, styles.addButton, !plantName.trim() && styles.buttonDisabled]}
          onPress={handleAddPlant}
          disabled={!plantName.trim()}
        >
          <Text style={styles.buttonText}>Add Plant</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: '#D8F3DC',
  },
  errorMessage: {
    backgroundColor: '#FFEBEE',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  successText: {
    color: '#14532D',
  },
  errorText: {
    color: '#C62828',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14532D',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: '#1B4332',
  },
  buttonDisabled: {
    backgroundColor: '#2D6A4F',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
