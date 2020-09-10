import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Jitsi from './src/screens/Jitsi'
import Login from './src/screens/Login'
import SplashScreen from './src/screens/SplashScreen'
import Dashboard from './src/screens/Dashboard'

export default function App(){

  const Stack = createStackNavigator();


  return(
    <NavigationContainer>
            <Stack.Navigator initialRouteName='SplashScreen'>
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerMode: 'none', headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerMode: 'none', headerShown: false }} />
              <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerMode: 'none', headerShown: false }} />
              <Stack.Screen name="Jitsi" component={Jitsi} options={{ headerMode: 'none', headerShown: false }}/>
            </Stack.Navigator>
    </NavigationContainer>
  )
}

