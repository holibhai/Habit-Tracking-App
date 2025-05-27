import AsyncStorage from '@react-native-async-storage/async-storage';

export const logoutUser = async () => {
  try {
    await AsyncStorage.clear(); 
    console.log('User logged out and AsyncStorage cleared.');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};