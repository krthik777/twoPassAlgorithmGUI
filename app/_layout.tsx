import React, { useState } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import Pass1Screen from './screens/Pass1Screen';
import Pass2Screen from './screens/Pass2Screen';
import SplashScreen from './splashscreen';

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <SplashScreen onLoaded={() => setLoaded(true)} />}
      {loaded && (
        <NavigationContainer independent={true} theme={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
          <Tab.Navigator>
            <Tab.Screen name="Pass 1" component={Pass1Screen} />
            <Tab.Screen name="Pass 2" component={Pass2Screen} />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
