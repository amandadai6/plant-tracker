import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getPlants, savePlants } from '../storage/plantStorage';

const PlantContext = createContext();

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

export function PlantProvider({ children }) {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: load once on mount
  useEffect(() => {
    loadPlants();
  }, []);

  async function loadPlants() {
    try {
      const storedPlants = await getPlants();
      setPlants(storedPlants);
    } catch {
      Alert.alert('Error', 'Failed to load your plants. Please restart the app.');
    } finally {
      setIsLoading(false);
    }
  }

  // speciesData is optional — null when user skips species search.
  // When provided, it contains care fields from the Perenual API.
  async function addPlant(nickname, speciesData = null, spriteKey = 'sprout') {
    const newPlant = {
      id: generateId(),
      nickname: nickname.trim(),
      speciesId: speciesData?.speciesId || null,
      speciesName: speciesData?.commonName || null,
      scientificName: speciesData?.scientificName || null,
      watering: speciesData?.watering || null,
      sunlight: speciesData?.sunlight || [],
      cycle: speciesData?.cycle || null,
      sprite: spriteKey,
      lastWatered: null,
      lastPestTreatment: null,
    };
    let previous;
    let next;
    setPlants(prev => {
      previous = prev;
      next = [...prev, newPlant];
      return next;
    });
    try {
      await savePlants(next);
    } catch {
      setPlants(previous);
      throw new Error('Failed to save plant.');
    }
  }

  async function deletePlant(id) {
    let previous;
    let next;
    setPlants(prev => {
      previous = prev;
      next = prev.filter(p => p.id !== id);
      return next;
    });
    try {
      await savePlants(next);
    } catch {
      setPlants(previous);
      Alert.alert('Error', 'Failed to delete plant. Please try again.');
    }
  }

  async function updatePlantCare(id, field, value) {
    let previous;
    let next;
    setPlants(prev => {
      previous = prev;
      next = prev.map(p => p.id === id ? { ...p, [field]: value } : p);
      return next;
    });
    try {
      await savePlants(next);
    } catch {
      setPlants(previous);
      Alert.alert('Error', 'Failed to update plant. Please try again.');
    }
  }

  async function updatePlantName(id, newName) {
    let previous;
    let next;
    setPlants(prev => {
      previous = prev;
      next = prev.map(p => p.id === id ? { ...p, nickname: newName.trim() } : p);
      return next;
    });
    try {
      await savePlants(next);
    } catch {
      setPlants(previous);
      Alert.alert('Error', 'Failed to rename plant. Please try again.');
    }
  }

  return (
    <PlantContext.Provider
      value={{
        plants,
        isLoading,
        addPlant,
        deletePlant,
        updatePlantCare,
        updatePlantName,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlants() {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
}
