import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import HabitListScreen from '../screens/HabitListScreen';
import ProgressTrackerScreen from '../screens/ProgressTracker';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Login');

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="HabitList" component={HabitListScreen} />
      <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
      <Stack.Screen name='progress' component={ProgressTrackerScreen}  />
    </Stack.Navigator>
  );
};

export default AppNavigator;