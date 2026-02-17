import AsyncStorage from '@react-native-async-storage/async-storage';

const PLANTS_KEY = 'plants';

export async function getPlants() {
  const jsonValue = await AsyncStorage.getItem(PLANTS_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

export async function savePlants(plants) {
  const jsonValue = JSON.stringify(plants);
  await AsyncStorage.setItem(PLANTS_KEY, jsonValue);
}
