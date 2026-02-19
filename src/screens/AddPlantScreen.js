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
} from 'react-native';
import { usePlants } from '../context/PlantContext';
import { searchPlants } from '../services/plantApi';

// Flow: search species (optional) → select or skip → enter nickname → save
export default function AddPlantScreen() {
  const { addPlant } = usePlants();

  // Species search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected species (null if user skips)
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  // Nickname step — visible after species selection or skip
  const [showNicknameStep, setShowNicknameStep] = useState(false);
  const [plantName, setPlantName] = useState('');
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
    // Pre-fill nickname with the common name
    setPlantName(species.commonName || '');
    setShowNicknameStep(true);
  }

  function handleSkip() {
    setSelectedSpecies(null);
    setPlantName('');
    setShowNicknameStep(true);
  }

  // Go back from nickname step to search step
  function handleBackToSearch() {
    setShowNicknameStep(false);
    setSelectedSpecies(null);
    setPlantName('');
  }

  async function handleAddPlant() {
    if (!plantName.trim()) return;

    try {
      await addPlant(plantName, selectedSpecies);
      setPlantName('');
      setSelectedSpecies(null);
      setShowNicknameStep(false);
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
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

  // --- Nickname step ---
  if (showNicknameStep) {
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
          <Text style={styles.title}>Name Your Plant</Text>
          {selectedSpecies && (
            <Text style={styles.subtitle}>
              Species: {selectedSpecies.commonName}
            </Text>
          )}
          {!selectedSpecies && (
            <Text style={styles.subtitle}>
              Give your plant a nickname to start tracking its care.
            </Text>
          )}

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

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={handleBackToSearch}
          >
            <Text style={styles.backButtonText}>Back to Search</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // --- Search step (default) ---
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

      <View style={styles.searchContent}>
        <Text style={styles.title}>Add a Plant</Text>
        <Text style={styles.subtitle}>
          Search for a plant species, or skip to add with just a nickname.
        </Text>

        {/* Search input row */}
        <View style={styles.searchRow}>
          <TextInput
            style={[styles.input, styles.searchInput]}
            placeholder="Search species (e.g., Monstera)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={[styles.searchButton, !searchQuery.trim() && styles.buttonDisabled]}
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Loading indicator */}
        {isSearching && (
          <ActivityIndicator size="large" color="#1B4332" style={styles.loader} />
        )}

        {/* Search error */}
        {searchError && (
          <Text style={styles.searchErrorText}>{searchError}</Text>
        )}

        {/* Empty results */}
        {hasSearched && !isSearching && searchResults.length === 0 && !searchError && (
          <Text style={styles.emptyText}>No plants found. Try a different search or skip.</Text>
        )}

        {/* Search results list */}
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => String(item.speciesId)}
            renderItem={renderSpeciesItem}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Skip button — always visible */}
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip — Add Without Species</Text>
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
  searchContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
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
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1B4332',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B4332',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
  searchErrorText: {
    color: '#C62828',
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 14,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
  },
  resultsList: {
    flex: 1,
    marginVertical: 8,
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
});
