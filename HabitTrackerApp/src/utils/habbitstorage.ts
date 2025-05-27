import AsyncStorage from '@react-native-async-storage/async-storage';

export type Habit = {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly';
  createdAt: string;
  completedDates: string[];
};

const HABITS_KEY = 'habits';

export const saveHabit = async (habit: Habit) => {
  const habits = await getHabits();
  habits.push(habit);
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const getHabits = async (): Promise<Habit[]> => {
  const data = await AsyncStorage.getItem(HABITS_KEY);
  return data ? JSON.parse(data) : [];
};