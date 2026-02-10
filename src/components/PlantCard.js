import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePlants } from '../context/PlantContext';
import CalendarPickerModal from './CalendarPickerModal';
import ConfirmModal from './ConfirmModal';
import EditNameModal from './EditNameModal';

export default function PlantCard({ plant }) {
  const { deletePlant, updatePlantCare, updatePlantName } = usePlants();
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showPestPicker, setShowPestPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);

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

  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    deletePlant(plant.id);
  }

  function handleNameSave(newName) {
    setShowEditNameModal(false);
    updatePlantName(plant.id, newName);
  }

  function handleWaterDateConfirm(dateString) {
    setShowWaterPicker(false);
    const date = new Date(dateString);
    updatePlantCare(plant.id, 'lastWatered', date.toISOString());
  }

  function handleWaterDateClear() {
    setShowWaterPicker(false);
    updatePlantCare(plant.id, 'lastWatered', null);
  }

  function handlePestDateConfirm(dateString) {
    setShowPestPicker(false);
    const date = new Date(dateString);
    updatePlantCare(plant.id, 'lastPestTreatment', date.toISOString());
  }

  function handlePestDateClear() {
    setShowPestPicker(false);
    updatePlantCare(plant.id, 'lastPestTreatment', null);
  }

  function getDateString(isoString) {
    if (!isoString) return null;
    return isoString.split('T')[0];
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setShowEditNameModal(true)}
          style={styles.nameButton}
        >
          <Text style={styles.name}>{plant.nickname}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setShowDeleteModal(true)} 
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>✕</Text>
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
        onClear={handleWaterDateClear}
        showClear={!!plant.lastWatered}
        minDate={minDate}
        maxDate={maxDate}
        title="Last Watered"
      />

      <CalendarPickerModal
        visible={showPestPicker}
        selectedDate={getDateString(plant.lastPestTreatment)}
        onConfirm={handlePestDateConfirm}
        onCancel={() => setShowPestPicker(false)}
        onClear={handlePestDateClear}
        showClear={!!plant.lastPestTreatment}
        minDate={minDate}
        maxDate={maxDate}
        title="Last Pest Treatment"
      />

      <ConfirmModal
        visible={showDeleteModal}
        message="Are you sure you want to remove this plant from your list?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <EditNameModal
        visible={showEditNameModal}
        currentName={plant.nickname}
        onSave={handleNameSave}
        onCancel={() => setShowEditNameModal(false)}
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
  nameButton: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#14532D',
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '300',
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
    backgroundColor: '#D8F3DC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  dateText: {
    color: '#14532D',
    fontWeight: '500',
  },
});
