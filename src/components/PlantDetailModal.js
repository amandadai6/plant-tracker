import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Modal, Image } from 'react-native';
import { usePlants } from '../context/PlantContext';
import { SPRITES } from '../sprites';
import CalendarPickerModal from './CalendarPickerModal';
import ConfirmModal from './ConfirmModal';

const trashSprite = require('../../assets/sprites/trash.png');

export default function PlantDetailModal({ visible, plant, onClose }) {
  const { deletePlant, updatePlantCare, updatePlantName } = usePlants();
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showPestPicker, setShowPestPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spriteIndex, setSpriteIndex] = useState(0);
  const [isEditingSprite, setIsEditingSprite] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (visible && plant) {
      const idx = SPRITES.findIndex(s => s.key === plant.sprite);
      setSpriteIndex(idx >= 0 ? idx : 0);
      setIsEditingSprite(false);
      setIsEditingName(false);
      setEditingName(plant.nickname);
    }
  }, [visible, plant?.sprite, plant?.nickname]);

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
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    return `${month}/${day}/${year}`;
  }

  function getDateString(isoString) {
    if (!isoString) return null;
    return isoString.split('T')[0];
  }

  function handlePrevSprite() {
    setSpriteIndex(i => (i - 1 + SPRITES.length) % SPRITES.length);
  }

  function handleNextSprite() {
    setSpriteIndex(i => (i + 1) % SPRITES.length);
  }

  function handleConfirmSprite() {
    updatePlantCare(plant.id, 'sprite', SPRITES[spriteIndex].key);
    setIsEditingSprite(false);
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    onClose();
    deletePlant(plant.id);
  }

  function handleNameBlur() {
    setIsEditingName(false);
    const trimmed = editingName.trim();
    if (trimmed) {
      updatePlantName(plant.id, trimmed);
    } else {
      setEditingName(plant.nickname);
    }
  }

  function handleWaterDateConfirm(dateString) {
    setShowWaterPicker(false);
    updatePlantCare(plant.id, 'lastWatered', dateString);
  }

  function handlePestDateConfirm(dateString) {
    setShowPestPicker(false);
    updatePlantCare(plant.id, 'lastPestTreatment', dateString);
  }


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => { if (isEditingSprite) handleConfirmSprite(); }}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.container}>
          <View style={styles.header}>
            {isEditingSprite ? (
              <View style={styles.spritePickerInline}>
                <TouchableOpacity style={styles.arrowButton} onPress={handlePrevSprite}>
                  <Text style={styles.arrowText}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmSprite}>
                  <Image source={SPRITES[spriteIndex].source} style={styles.spriteImage} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.arrowButton} onPress={handleNextSprite}>
                  <Text style={styles.arrowText}>→</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingSprite(true)}>
                <Image source={SPRITES[spriteIndex].source} style={styles.spriteImage} resizeMode="contain" />
              </TouchableOpacity>
            )}
            <View style={[styles.nameWrapper, isEditingName && styles.nameWrapperActive]}>
              <TextInput
                style={styles.nameInput}
                value={editingName}
                onChangeText={setEditingName}
                onFocus={() => setIsEditingName(true)}
                onBlur={handleNameBlur}
              />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.careRow}>
            <Text style={styles.careLabel}>Last Watered</Text>
            <View style={styles.dateGroup}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowWaterPicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(plant.lastWatered)}</Text>
              </TouchableOpacity>
              {!!plant.lastWatered && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => updatePlantCare(plant.id, 'lastWatered', null)}
                >
                  <Text style={styles.clearDateText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.careRow}>
            <Text style={styles.careLabel}>Last Pest Treatment</Text>
            <View style={styles.dateGroup}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPestPicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(plant.lastPestTreatment)}</Text>
              </TouchableOpacity>
              {!!plant.lastPestTreatment && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => updatePlantCare(plant.id, 'lastPestTreatment', null)}
                >
                  <Text style={styles.clearDateText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Image source={trashSprite} style={styles.trashIcon} />
            <Text style={styles.deleteButtonText}>Delete plant</Text>
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>

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

      <ConfirmModal
        visible={showDeleteModal}
        message="Are you sure you want to remove this plant from your list?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Remove"
        cancelText="Cancel"
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
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  nameWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  nameWrapperActive: {
    borderWidth: 1.5,
    borderColor: '#14532D',
  },
  nameInput: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: '#14532D',
    padding: 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 20,
    color: '#666666',
  },
  spritePickerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrowButton: {
    padding: 4,
  },
  arrowText: {
    fontSize: 18,
    color: '#1B4332',
    fontFamily: 'Nunito_700Bold',
  },
  spriteImage: {
    width: 38,
    height: 38,
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
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#666',
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateButton: {
    backgroundColor: '#D8F3DC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearDateButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearDateText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#999',
  },
  dateText: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#14532D',
    fontSize: 13,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
  },
  trashIcon: {
    width: 20,
    height: 20,
  },
  deleteButtonText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#999',
  },
});
