import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { saveHabit, Habit } from '../utils/habbitStorage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  CreateHabit: undefined;
  HabitList: undefined;
};

const generateId = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

const CreateHabitScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | ''>('');

  const handleSaveHabit = async () => {
    if (!habitName || !frequency) {
      Alert.alert('Missing Info', 'Please enter a habit name and choose frequency');
      return;
    }

    const newHabit: Habit = {
      id: generateId(),
      name: habitName.trim(),
      frequency,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };

    await saveHabit(newHabit);
    Alert.alert('Success', 'Habit saved!');
    navigation.navigate('HabitList');
    setHabitName('');
    setFrequency('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Create a New Habit</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Drink Water"
          placeholderTextColor="#aaa"
          value={habitName}
          onChangeText={setHabitName}
        />

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyRow}>
          <TouchableOpacity
            style={[styles.freqOption, frequency === 'Daily' && styles.selected]}
            onPress={() => setFrequency('Daily')}
          >
            <Text style={styles.optionText}>🌞 Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.freqOption, frequency === 'Weekly' && styles.selected]}
            onPress={() => setFrequency('Weekly')}
          >
            <Text style={styles.optionText}>📅 Weekly</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveHabit}>
          <Text style={styles.saveButtonText}>✅ Save Habit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateHabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8ff',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#304ffe',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f4ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#c3dafe',
    borderWidth: 1,
    color: '#000',
  },
  frequencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  freqOption: {
    flex: 1,
    backgroundColor: '#e0e7ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: '#4f46e5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});