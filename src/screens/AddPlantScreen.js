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

export default function AddPlantScreen({ navigation }) {
  const [plantName, setPlantName] = useState('');
  const { addPlant, plants } = usePlants();

  async function handleAddPlant() {
    if (plantName.trim()) {
      await addPlant(plantName);
      setPlantName('');
    }
  }

  function handleGoToMyPlants() {
    navigation.replace('Home');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

        {plants.length > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.goButton]}
            onPress={handleGoToMyPlants}
          >
            <Text style={[styles.buttonText, styles.goButtonText]}>
              Go to My Plants ({plants.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
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
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  goButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  goButtonText: {
    color: '#4CAF50',
  },
});
