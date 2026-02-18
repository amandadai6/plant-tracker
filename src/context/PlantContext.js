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
  async function addPlant(nickname, speciesData = null) {
    const newPlant = {
      id: generateId(),
      nickname: nickname.trim(),
      speciesId: speciesData?.speciesId || null,
      speciesName: speciesData?.commonName || null,
      scientificName: speciesData?.scientificName || null,
      watering: speciesData?.watering || null,
      sunlight: speciesData?.sunlight || [],
      cycle: speciesData?.cycle || null,
      thumbnail: speciesData?.thumbnail || null,
      lastWatered: null,
      lastPestTreatment: null,
    };
    const previousPlants = plants;
    const updatedPlants = [...plants, newPlant];
    setPlants(updatedPlants);
    try {
      await savePlants(updatedPlants);
    } catch {
      setPlants(previousPlants);
      throw new Error('Failed to save plant.');
    }
  }

  async function deletePlant(id) {
    const previousPlants = plants;
    const updatedPlants = plants.filter((plant) => plant.id !== id);
    setPlants(updatedPlants);
    try {
      await savePlants(updatedPlants);
    } catch {
      setPlants(previousPlants);
      Alert.alert('Error', 'Failed to delete plant. Please try again.');
    }
  }

  async function updatePlantCare(id, field, date) {
    const previousPlants = plants;
    const updatedPlants = plants.map((plant) =>
      plant.id === id ? { ...plant, [field]: date } : plant
    );
    setPlants(updatedPlants);
    try {
      await savePlants(updatedPlants);
    } catch {
      setPlants(previousPlants);
      Alert.alert('Error', 'Failed to update plant. Please try again.');
    }
  }

  async function updatePlantName(id, newName) {
    const previousPlants = plants;
    const updatedPlants = plants.map((plant) =>
      plant.id === id ? { ...plant, nickname: newName.trim() } : plant
    );
    setPlants(updatedPlants);
    try {
      await savePlants(updatedPlants);
    } catch {
      setPlants(previousPlants);
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
