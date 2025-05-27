import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUser = async (user: { name: string; email: string; password: string }) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearUser = async () => {
  await AsyncStorage.removeItem('user');
};