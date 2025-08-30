import { CurrencySelector, formatCurrency, getCurrencySymbol } from '@/components/CurrencySelector';
import { DatePicker } from '@/components/DatePicker';
import { useSavings } from '@/hooks/savings-store';
import { useTheme } from '@/hooks/theme-store';
import { Currency } from '@/types/savings';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React, { useState } from 'react';
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

export default function CreateGoalScreen() {
  const { addGoal } = useSavings();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default to 30 days from now
  const [currency, setCurrency] = useState<Currency>('USD');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCreateGoal = () => {
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
      addGoal({
        name: name.trim(),
        targetAmount: amount,
        targetDate: targetDate.toISOString(),
        currency,
        imageUri,
      });

      router.back();
    } catch (error) {
      console.error('Error creating goal:', error);
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const dynamicStyles = StyleSheet.create({
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
      fontWeight: '700' as const,
      color: theme.colors.text,
      marginBottom: 16,
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
    createButton: {
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
    createButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700' as const,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Create Goal',
          headerBackTitle: 'Back'
        }} 
      />
      
      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Goal Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.goalImage} />
            ) : (
              <View style={dynamicStyles.imagePlaceholder}>
                <Camera size={32} color={theme.colors.textMuted} />
                <Text style={dynamicStyles.imagePlaceholderText}>Add motivational image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Goal Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={dynamicStyles.inputLabel}>Goal Name</Text>
            <TextInput
              style={dynamicStyles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g., New Car, Vacation, Emergency Fund"
              placeholderTextColor={theme.colors.textMuted}
              testID="goal-name-input"
            />
          </View>

          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
          />

          <View style={styles.inputGroup}>
            <Text style={dynamicStyles.inputLabel}>Target Amount</Text>
            <View style={styles.inputWithIcon}>
              <Text style={dynamicStyles.currencySymbol}>{getCurrencySymbol(currency)}</Text>
              <TextInput
                style={[dynamicStyles.textInput, dynamicStyles.textInputWithIcon]}
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textMuted}
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
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Preview</Text>
            <View style={dynamicStyles.previewCard}>
              <Text style={dynamicStyles.previewGoalName}>{name}</Text>
              <Text style={dynamicStyles.previewAmount}>
                Target: {formatCurrency(parseFloat(targetAmount || '0'), currency)}
              </Text>
              <Text style={dynamicStyles.previewDate}>
                Due: {targetDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={dynamicStyles.footer}>
        <TouchableOpacity
          style={[dynamicStyles.createButton, isLoading && dynamicStyles.createButtonDisabled]}
          onPress={handleCreateGoal}
          disabled={isLoading}
          testID="create-goal-button"
        >
          <Text style={dynamicStyles.createButtonText}>
            {isLoading ? 'Creating...' : 'Create Goal'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: 'center',
  },
  goalImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputWithIcon: {
    position: 'relative',
  },
});