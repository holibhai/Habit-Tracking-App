import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { getHabits, Habit } from '../utils/habbitStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const today = new Date().toISOString().split('T')[0];

const HabitListScreen = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<'All' | 'Daily' | 'Weekly'>('All');
  const navigation = useNavigation<any>();

  const loadHabits = async () => {
    const data = await getHabits();
    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const markCompleted = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updated = habits.map(habit =>
      habit.id === id && !habit.completedDates.includes(today)
        ? { ...habit, completedDates: [...habit.completedDates, today] }
        : habit
    );
    setHabits(updated);
    await AsyncStorage.setItem('habits', JSON.stringify(updated));
    Alert.alert('🎉 Success', 'Habit marked as completed!');
  };

  const deleteHabit = async (id: string) => {
    Alert.alert('🗑 Confirm Delete', 'Do you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const updated = habits.filter(h => h.id !== id);
          setHabits(updated);
          await AsyncStorage.setItem('habits', JSON.stringify(updated));
          Alert.alert('✅ Deleted', 'Habit removed successfully!');
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const renderHabit = ({ item }: { item: Habit }) => {
    const isCompletedToday = item.completedDates.includes(today);
    return (
      <View style={styles.habitItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.habitName}>📌 {item.name}</Text>
          <Text style={styles.habitInfo}>📅 Frequency: {item.frequency}</Text>
          <Text style={styles.habitInfo}>
            {isCompletedToday ? '✅ Completed Today' : '❌ Not Completed Yet'}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          {!isCompletedToday && (
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => markCompleted(item.id)}
            >
              <Text style={styles.completeText}>✅ Done</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteHabit(item.id)}
          >
            <Text style={styles.deleteText}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 My Habit Tracker</Text>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate('CreateHabit')}
      >
        <Text style={styles.createText}>➕ Add New Habit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.progressBtn}
        onPress={() => navigation.navigate('progress')}
      >
        <Text style={styles.progressText}>📈 Track Progress</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        {['All', 'Daily', 'Weekly'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type as 'All' | 'Daily' | 'Weekly')}
            style={[
              styles.filterButton,
              filter === type && styles.selectedFilterButton,
            ]}
          >
            <Text style={styles.filterText}>
              {type === 'All' ? '🌍' : type === 'Daily' ? '📆' : '🗓'} {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={habits.filter(habit =>
          filter === 'All' ? true : habit.frequency === filter
        )}
        keyExtractor={item => item.id}
        renderItem={renderHabit}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits found. Create one!</Text>
        }
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HabitListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4ff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#3e3e92',
  },
  habitItem: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6c63ff',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderLeftWidth: 6,
    borderLeftColor: '#6c63ff',
  },
  habitName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    color: '#3e3e92',
  },
  habitInfo: {
    fontSize: 15,
    color: '#555',
  },
  completeBtn: {
    backgroundColor: '#00c853',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  completeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#ff5252',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createBtn: {
    backgroundColor: '#3e3e92',
    padding: 14,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  createText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBtn: {
    backgroundColor: '#00b0ff',
    padding: 14,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtn: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#aa00ff',
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#d1c4e9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectedFilterButton: {
    backgroundColor: '#7e57c2',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 17,
    marginTop: 40,
    color: '#888',
  },
});