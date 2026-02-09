import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePlants } from '../context/PlantContext';
import CalendarPickerModal from './CalendarPickerModal';

export default function PlantCard({ plant }) {
  const { deletePlant, updatePlantCare } = usePlants();
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showPestPicker, setShowPestPicker] = useState(false);

  // Date range: 12 months in the past to 1 month from today
  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - 12);
  
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);

  function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  function handleDelete() {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete "${plant.nickname}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePlant(plant.id) },
      ]
    );
  }

  function handleWaterDateConfirm(dateString) {
    setShowWaterPicker(false);
    const date = new Date(dateString);
    updatePlantCare(plant.id, 'lastWatered', date.toISOString());
  }

  function handlePestDateConfirm(dateString) {
    setShowPestPicker(false);
    const date = new Date(dateString);
    updatePlantCare(plant.id, 'lastPestTreatment', date.toISOString());
  }

  function getDateString(isoString) {
    if (!isoString) return null;
    return isoString.split('T')[0];
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{plant.nickname}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.careRow}>
        <Text style={styles.careLabel}>Last Watered:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowWaterPicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(plant.lastWatered)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.careRow}>
        <Text style={styles.careLabel}>Last Pest Treatment:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPestPicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(plant.lastPestTreatment)}</Text>
        </TouchableOpacity>
      </View>

      <CalendarPickerModal
        visible={showWaterPicker}
        selectedDate={getDateString(plant.lastWatered)}
        onConfirm={handleWaterDateConfirm}
        onCancel={() => setShowWaterPicker(false)}
        minDate={minDate}
        maxDate={maxDate}
        title="Last Watered"
      />

      <CalendarPickerModal
        visible={showPestPicker}
        selectedDate={getDateString(plant.lastPestTreatment)}
        onConfirm={handlePestDateConfirm}
        onCancel={() => setShowPestPicker(false)}
        minDate={minDate}
        maxDate={maxDate}
        title="Last Pest Treatment"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffebee',
    borderRadius: 6,
  },
  deleteText: {
    color: '#c62828',
    fontWeight: '500',
  },
  careRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  careLabel: {
    fontSize: 14,
    color: '#666',
  },
  dateButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  dateText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
});
