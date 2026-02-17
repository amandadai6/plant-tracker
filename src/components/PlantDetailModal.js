import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { usePlants } from '../context/PlantContext';
import CalendarPickerModal from './CalendarPickerModal';
import ConfirmModal from './ConfirmModal';
import EditNameModal from './EditNameModal';

export default function PlantDetailModal({ visible, plant, onClose }) {
  const { deletePlant, updatePlantCare, updatePlantName } = usePlants();
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showPestPicker, setShowPestPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);

  const { minDate, maxDate } = useMemo(() => {
    const min = new Date();
    min.setMonth(min.getMonth() - 12);
    const max = new Date();
    max.setMonth(max.getMonth() + 1);
    return { minDate: min, maxDate: max };
  }, []);

  if (!plant) return null;

  function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  function getDateString(isoString) {
    if (!isoString) return null;
    return isoString.split('T')[0];
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    onClose();
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setShowEditNameModal(true)}
              style={styles.nameButton}
            >
              <Text style={styles.name}>{plant.nickname}</Text>
              <Text style={styles.editHint}>tap to edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.careRow}>
            <Text style={styles.careLabel}>Last Watered</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowWaterPicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(plant.lastWatered)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.careRow}>
            <Text style={styles.careLabel}>Last Pest Treatment</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPestPicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(plant.lastPestTreatment)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.deleteButtonText}>Delete Plant</Text>
          </TouchableOpacity>
        </View>
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameButton: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#14532D',
  },
  editHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  careRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
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
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
});
