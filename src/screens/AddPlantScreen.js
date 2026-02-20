import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { usePlants } from '../context/PlantContext';
import { searchPlants } from '../services/plantApi';
import { SPRITES } from '../sprites';

export default function AddPlantScreen() {
  const { addPlant } = usePlants();

  const [step, setStep] = useState('form'); // 'form' | 'sprite'

  // Form step state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [plantName, setPlantName] = useState('');

  // Sprite step state
  const [spriteIndex, setSpriteIndex] = useState(0);

  const [message, setMessage] = useState(null);
  const feedbackTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    };
  }, []);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(false);
    try {
      const results = await searchPlants(searchQuery);
      setSearchResults(results);
      setHasSearched(true);
    } catch {
      setSearchError('Could not search plants. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectSpecies(species) {
    setSelectedSpecies(species);
    setPlantName(species.commonName || '');
    setSearchResults([]);
    setHasSearched(false);
  }

  function handleNext() {
    setStep('sprite');
  }

  function handleBack() {
    setStep('form');
  }

  function handlePrevSprite() {
    setSpriteIndex(i => (i - 1 + SPRITES.length) % SPRITES.length);
  }

  function handleNextSprite() {
    setSpriteIndex(i => (i + 1) % SPRITES.length);
  }

  async function handleAddPlant() {
    if (!plantName.trim()) return;
    try {
      await addPlant(plantName, selectedSpecies, SPRITES[spriteIndex].key);
      setPlantName('');
      setSelectedSpecies(null);
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      setSpriteIndex(0);
      setStep('form');
      showFeedback('success', 'Plant added!');
    } catch {
      showFeedback('error', 'Failed to add plant. Please try again.');
    }
  }

  function showFeedback(type, text) {
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    setMessage({ type, text });
    feedbackTimeout.current = setTimeout(() => setMessage(null), 2500);
  }

  function renderSpeciesItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleSelectSpecies(item)}
      >
        <Text style={styles.resultName}>{item.commonName || 'Unknown'}</Text>
        {item.scientificName && (
          <Text style={styles.resultScientific}>{item.scientificName}</Text>
        )}
        {item.watering && (
          <Text style={styles.resultDetail}>Watering: {item.watering}</Text>
        )}
      </TouchableOpacity>
    );
  }

  function renderFeedback() {
    if (!message) return null;
    return (
      <View style={[styles.messageContainer, message.type === 'success' ? styles.successMessage : styles.errorMessage]}>
        <Text style={[styles.messageText, message.type === 'success' ? styles.successText : styles.errorText]}>
          {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
        </Text>
      </View>
    );
  }

  // --- Sprite picker step ---
  if (step === 'sprite') {
    const currentSprite = SPRITES[spriteIndex];
    return (
      <View style={styles.container}>
        {renderFeedback()}
        <View style={styles.spriteContent}>
          <Text style={styles.title}>Choose a Sprite</Text>
          <Text style={styles.subtitle}>{plantName}</Text>
          <View style={styles.spritePicker}>
            <TouchableOpacity style={styles.arrowButton} onPress={handlePrevSprite}>
              <Text style={styles.arrowText}>←</Text>
            </TouchableOpacity>
            <View style={styles.spritePreview}>
              <Image
                source={currentSprite.source}
                style={styles.spriteImage}
                resizeMode="contain"
              />
              <Text style={styles.spriteName}>{currentSprite.displayName}</Text>
            </View>
            <TouchableOpacity style={styles.arrowButton} onPress={handleNextSprite}>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddPlant}>
            <Text style={styles.buttonText}>Add Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Form step (search + name combined) ---
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderFeedback()}
      <View style={styles.formContent}>
        <Text style={styles.title}>Add a Plant</Text>
        <Text style={styles.subtitle}>
          Optionally search for a species, then give your plant a name.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            style={[styles.input, styles.searchInput]}
            placeholder="Search species (e.g., Monstera)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={[styles.searchButton, (!searchQuery.trim() || isSearching) && styles.buttonDisabled]}
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {isSearching && (
          <ActivityIndicator size="small" color="#1B4332" style={styles.loader} />
        )}
        {searchError && (
          <Text style={styles.searchErrorText}>{searchError}</Text>
        )}
        {hasSearched && !isSearching && searchResults.length === 0 && !searchError && (
          <Text style={styles.emptyText}>No plants found. Try a different search.</Text>
        )}
        {selectedSpecies && (
          <Text style={styles.selectedSpeciesText}>Species: {selectedSpecies.commonName}</Text>
        )}
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => String(item.speciesId)}
            renderItem={renderSpeciesItem}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Plant nickname (e.g., Kitchen fern)"
          value={plantName}
          onChangeText={setPlantName}
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[styles.button, styles.addButton, !plantName.trim() && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!plantName.trim()}
        >
          <Text style={styles.buttonText}>Next →</Text>
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
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  spriteContent: {
    flex: 1,
    alignItems: 'center',
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
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 0,
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#1B4332',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  loader: {
    marginVertical: 8,
  },
  searchErrorText: {
    color: '#C62828',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 14,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 14,
  },
  selectedSpeciesText: {
    fontSize: 13,
    color: '#2D6A4F',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  resultsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532D',
  },
  resultScientific: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 2,
  },
  resultDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#1B4332',
  },
  buttonDisabled: {
    backgroundColor: '#2D6A4F',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  spritePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
    gap: 24,
  },
  arrowButton: {
    padding: 12,
  },
  arrowText: {
    fontSize: 32,
    color: '#1B4332',
    fontWeight: 'bold',
  },
  spritePreview: {
    alignItems: 'center',
  },
  spriteImage: {
    width: 128,
    height: 128,
  },
  spriteName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#14532D',
  },
});
