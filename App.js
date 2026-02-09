import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlantProvider, usePlants } from './src/context/PlantContext';
import AddPlantScreen from './src/screens/AddPlantScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { plants, isLoading } = usePlants();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      {plants.length === 0 ? (
        <Stack.Screen
          name="AddPlant"
          component={AddPlantScreen}
          options={{ title: 'Add Plant' }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'My Plants' }}
          />
          <Stack.Screen
            name="AddPlant"
            component={AddPlantScreen}
            options={{ title: 'Add Plant' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PlantProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PlantProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
