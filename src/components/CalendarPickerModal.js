import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarPickerModal({
  visible,
  selectedDate,
  onConfirm,
  onCancel,
  minDate,
  maxDate,
  title,
}) {
  const [tempSelectedDate, setTempSelectedDate] = useState(null);

  useEffect(() => {
    if (visible) {
      setTempSelectedDate(selectedDate || null);
    }
  }, [visible, selectedDate]);

  function handleDayPress(day) {
    setTempSelectedDate(day.dateString);
  }

  function handleConfirm() {
    if (tempSelectedDate) {
      onConfirm(tempSelectedDate);
    }
  }

  function handleCancel() {
    setTempSelectedDate(null);
    onCancel();
  }

  function formatMinDate() {
    if (!minDate) return undefined;
    return minDate.toISOString().split('T')[0];
  }

  function formatMaxDate() {
    if (!maxDate) return undefined;
    return maxDate.toISOString().split('T')[0];
  }

  const markedDates = tempSelectedDate
    ? {
        [tempSelectedDate]: {
          selected: true,
          selectedColor: '#4CAF50',
        },
      }
    : {};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title && <Text style={styles.title}>{title}</Text>}

          <Calendar
            current={tempSelectedDate || undefined}
            minDate={formatMinDate()}
            maxDate={formatMaxDate()}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            enableSwipeMonths
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#666666',
              selectedDayBackgroundColor: '#4CAF50',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#4CAF50',
              dayTextColor: '#333333',
              textDisabledColor: '#d9d9d9',
              dotColor: '#4CAF50',
              selectedDotColor: '#ffffff',
              arrowColor: '#4CAF50',
              monthTextColor: '#2E7D32',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                !tempSelectedDate && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!tempSelectedDate}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
