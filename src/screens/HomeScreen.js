import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlants } from '../context/PlantContext';
import PlantGridCell from '../components/PlantGridCell';
import PlantDetailModal from '../components/PlantDetailModal';
import PalletTownBanner from '../components/PalletTownBanner';
import SoilStrip from '../components/SoilStrip';

const grassTile = require('../../assets/sprites/grass-tile.png');
const bulbasaur = require('../../assets/sprites/bulbasaur.png');
const charmander = require('../../assets/sprites/charmander.png');
const squirtle = require('../../assets/sprites/squirtle.png');
export default function HomeScreen({ navigation }) {
  const { plants } = usePlants();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selectedPlantId, setSelectedPlantId] = useState(null);

  const NUM_COLUMNS = 4;
  const GRID_PADDING = 24;
  const CELL_GAP = 4;
  const availableWidth = width - GRID_PADDING * 2;
  const numColumns = NUM_COLUMNS;
  const cellSize = Math.floor(
    (availableWidth - CELL_GAP * (numColumns - 1)) / numColumns,
  );

  const selectedPlant = selectedPlantId
    ? plants.find((p) => p.id === selectedPlantId) || null
    : null;

  useEffect(() => {
    if (selectedPlantId && !plants.find((p) => p.id === selectedPlantId)) {
      setSelectedPlantId(null);
    }
  }, [plants, selectedPlantId]);

  // Group plants into rows
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < plants.length; i += numColumns) {
      result.push(plants.slice(i, i + numColumns));
    }
    return result;
  }, [plants, numColumns]);

  function renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No plants yet!</Text>
        <Text style={styles.emptySubtitle}>
          Tap the + button below to add your first plant.
        </Text>
      </View>
    );
  }

  const soilStripWidth = availableWidth;
  const soilStripHeight = cellSize * 0.5;
  const soilOverlap = soilStripHeight * 0.7;

  return (
    <ImageBackground
      source={grassTile}
      resizeMode="repeat"
      style={styles.container}
    >
      <PalletTownBanner />

      {plants.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.grid,
            { paddingHorizontal: GRID_PADDING, paddingTop: insets.top + 60, paddingBottom: 80 },
          ]}
        >
          {rows.map((row) => (
            <View key={row.map((p) => p.id).join('-')} style={styles.rowContainer}>
              {/* Plants sitting above the soil */}
              <View style={styles.plantsRow}>
                {row.map((plant) => (
                  <View key={plant.id} style={{ width: cellSize }}>
                    <PlantGridCell
                      plant={plant}
                      onPress={(p) => setSelectedPlantId(p.id)}
                      cellSize={cellSize}
                    />
                  </View>
                ))}
              </View>
              {/* Continuous soil strip pulled up into the plants */}
              <SoilStrip
                width={soilStripWidth}
                height={soilStripHeight}
                borderRadius={soilStripHeight / 2}
                marginTop={-soilOverlap}
              />
            </View>
          ))}
        </ScrollView>
      )}

      <View style={[styles.starterRow, { bottom: insets.bottom + 20 }]}>
        <Image source={bulbasaur} style={styles.starterSprite} />
        <Image source={charmander} style={[styles.starterSprite, { width: 24, height: 24 }]} />
        <Image source={squirtle} style={[styles.starterSprite, { width: 24, height: 24 }]} />
      </View>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => navigation.navigate('AddPlant')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <PlantDetailModal
        visible={!!selectedPlant}
        plant={selectedPlant}
        onClose={() => setSelectedPlantId(null)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    alignItems: 'flex-start',
  },
  rowContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  plantsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starterRow: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  starterSprite: {
    width: 48,
    height: 48,
    imageRendering: 'pixelated',
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1B4332',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
});
