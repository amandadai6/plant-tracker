import React from 'react';
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
  function handleDayPress(day) {
    onConfirm(day.dateString);
  }

  function handleDismiss() {
    onCancel();
  }

  function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const markedDates = selectedDate
    ? {
        [selectedDate]: {
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
            current={selectedDate || new Date().toISOString().split('T')[0]}
            minDate={minDate ? formatLocalDate(minDate) : undefined}
            maxDate={maxDate ? formatLocalDate(maxDate) : undefined}
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
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
    fontFamily: 'Nunito_400Regular',
    fontSize: 20,
    color: '#666666',
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 16,
  },
});
