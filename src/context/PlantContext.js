import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlants, savePlants } from '../storage/plantStorage';

const PlantContext = createContext();

export function PlantProvider({ children }) {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlants();
  }, []);

  async function loadPlants() {
    const storedPlants = await getPlants();
    setPlants(storedPlants);
    setIsLoading(false);
  }

  async function addPlant(nickname) {
    const newPlant = {
      id: Date.now().toString(),
      nickname: nickname.trim(),
      speciesId: null,
      speciesName: null,
      lastWatered: null,
      lastPestTreatment: null,
    };
    const updatedPlants = [...plants, newPlant];
    setPlants(updatedPlants);
    await savePlants(updatedPlants);
  }

  async function deletePlant(id) {
    const updatedPlants = plants.filter((plant) => plant.id !== id);
    setPlants(updatedPlants);
    await savePlants(updatedPlants);
  }

  async function updatePlantCare(id, field, date) {
    const updatedPlants = plants.map((plant) =>
      plant.id === id ? { ...plant, [field]: date } : plant
    );
    setPlants(updatedPlants);
    await savePlants(updatedPlants);
  }

  async function updatePlantName(id, newName) {
    const updatedPlants = plants.map((plant) =>
      plant.id === id ? { ...plant, nickname: newName.trim() } : plant
    );
    setPlants(updatedPlants);
    await savePlants(updatedPlants);
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
