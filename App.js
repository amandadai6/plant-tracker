import React from 'react';
import { ActivityIndicator, View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { PlantProvider, usePlants } from './src/context/PlantContext';
import AddPlantScreen from './src/screens/AddPlantScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

function CustomHeader({ navigation, title }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.customHeader, { paddingTop: insets.top }]}>
      <Pressable
        onPress={() => navigation.navigate('Home')}
        style={({ pressed }) => [
          styles.homeButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <Feather name="home" size={28} color="#fff" />
      </Pressable>
      <Text style={styles.customHeaderTitle}>{title}</Text>
      <View style={styles.headerRightPlaceholder} />
    </View>
  );
}

function AppNavigator() {
  const { plants, isLoading } = usePlants();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4332" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1B4332' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        headerBackVisible: false,
        headerLeft: () => null,
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddPlant"
            component={AddPlantScreen}
            options={({ navigation }) => ({
              header: () => <CustomHeader navigation={navigation} title="Add Plant" />,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PressStart2P: require('./assets/fonts/PressStart2P.ttf'),
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4332" />
      </View>
    );
  }

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
  customHeader: {
    backgroundColor: '#1B4332',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  homeButton: {
    padding: 4,
  },
  customHeaderTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  headerRightPlaceholder: {
    width: 36,
  },
});
