import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarPickerModal({
  visible,
  selectedDate,
  onConfirm,
  onCancel,
  onClear,
  showClear,
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

  function handleDismiss() {
    setTempSelectedDate(null);
    onCancel();
  }

  function handleClear() {
    setTempSelectedDate(null);
    if (onClear) {
      onClear();
    }
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
          selectedColor: '#1B4332',
        },
      }
    : {};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

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
              selectedDayBackgroundColor: '#1B4332',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#1B4332',
              dayTextColor: '#333333',
              textDisabledColor: '#d9d9d9',
              dotColor: '#1B4332',
              selectedDotColor: '#ffffff',
              arrowColor: '#1B4332',
              monthTextColor: '#14532D',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />

          {/* Only show button row if there's something to show */}
          {(showClear || tempSelectedDate) && (
            <View style={styles.buttonRow}>
              {showClear ? (
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={handleClear}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.button} />
              )}

              {tempSelectedDate && (
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14532D',
    flex: 1,
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
  clearButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    backgroundColor: '#1B4332',
  },
  confirmButtonDisabled: {
    backgroundColor: '#2D6A4F',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
