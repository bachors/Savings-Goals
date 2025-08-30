import { useTheme } from '@/hooks/theme-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  testID?: string;
}

export function DatePicker({ label, value, onChange, minimumDate, testID }: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    dateButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 12,
    },
    dateText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.label}>{label}</Text>
      <TouchableOpacity
        style={dynamicStyles.dateButton}
        onPress={() => setShowPicker(true)}
        testID={testID}
      >
        <Calendar size={20} color={theme.colors.textMuted} style={dynamicStyles.icon} />
        <Text style={dynamicStyles.dateText}>
          {formatDate(value)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          testID={`${testID}-picker`}
        />
      )}
    </View>
  );
}

