import { CurrencySelector, formatCurrency, getCurrencySymbol } from '@/components/CurrencySelector';
import { DatePicker } from '@/components/DatePicker';
import { useSavings } from '@/hooks/savings-store';
import { useTheme } from '@/hooks/theme-store';
import { Currency } from '@/types/savings';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, updateGoal } = useSavings();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [currency, setCurrency] = useState<Currency>('USD');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const goal = goals.find(g => g.id === id);

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setTargetDate(new Date(goal.targetDate));
      setCurrency(goal.currency || 'USD');
      setImageUri(goal.imageUri);
    }
  }, [goal]);  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    imageContainer: {
      alignSelf: 'center',
    },
    goalImage: {
      width: 120,
      height: 120,
      borderRadius: 16,
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 16,
      backgroundColor: theme.colors.border,
      borderWidth: 2,
      borderColor: theme.colors.borderLight,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePlaceholderText: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: 8,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
    },
    inputWithIcon: {
      position: 'relative',
    },
    currencySymbol: {
      position: 'absolute',
      left: 16,
      top: 14,
      zIndex: 1,
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.textMuted,
    },
    textInputWithIcon: {
      paddingLeft: 48,
    },
    previewSection: {
      marginTop: 16,
    },
    previewCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    previewGoalName: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: theme.colors.text,
      marginBottom: 8,
    },
    previewAmount: {
      fontSize: 16,
      color: theme.colors.success,
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    previewDate: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    footer: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    updateButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    updateButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    updateButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700' as const,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: theme.colors.textMuted,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600' as const,
    },
  });

  if (!goal) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Goal Not Found' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Goal not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need camera roll permissions to select an image.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdateGoal = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }

    const amount = parseFloat(targetAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDate <= today) {
      Alert.alert('Error', 'Target date must be in the future');
      return;
    }

    setIsLoading(true);

    try {
      updateGoal(goal.id, {
        name: name.trim(),
        targetAmount: amount,
        targetDate: targetDate.toISOString(),
        currency,
        imageUri,
      });

      router.back();
    } catch (error) {
      console.error('Error updating goal:', error);
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Edit Goal',
          headerBackTitle: 'Back'
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.goalImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={32} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>Add motivational image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g., New Car, Vacation, Emergency Fund"
              placeholderTextColor="#9CA3AF"
              testID="goal-name-input"
            />
          </View>

          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Amount</Text>
            <View style={styles.inputWithIcon}>
              <Text style={styles.currencySymbol}>{getCurrencySymbol(currency)}</Text>
              <TextInput
                style={[styles.textInput, styles.textInputWithIcon]}
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                testID="target-amount-input"
              />
            </View>
          </View>

          <DatePicker
            label="Target Date"
            value={targetDate}
            onChange={setTargetDate}
            minimumDate={new Date()}
            testID="target-date-input"
          />
        </View>

        {name && targetAmount && (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewGoalName}>{name}</Text>
              <Text style={styles.previewAmount}>
                Target: {formatCurrency(parseFloat(targetAmount || '0'), currency)}
              </Text>
              <Text style={styles.previewDate}>
                Due: {targetDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
          onPress={handleUpdateGoal}
          disabled={isLoading}
          testID="update-goal-button"
        >
          <Text style={styles.updateButtonText}>
            {isLoading ? 'Updating...' : 'Update Goal'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  
}