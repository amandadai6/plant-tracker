import AsyncStorage from '@react-native-async-storage/async-storage';

const PLANTS_KEY = 'plants';

export async function getPlants() {
  try {
    const jsonValue = await AsyncStorage.getItem(PLANTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading plants:', error);
    return [];
  }
}

export async function savePlants(plants) {
  try {
    const jsonValue = JSON.stringify(plants);
    await AsyncStorage.setItem(PLANTS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving plants:', error);
  }
}
