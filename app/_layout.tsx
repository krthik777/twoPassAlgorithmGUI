import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Pass1Screen from './screens/Pass1Screen';
import Pass2Screen from './screens/Pass2Screen';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For tab icons
import SplashScreen from './splashscreen'; // Import your SplashScreen component

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Function to be called when splash screen animation is done
  const handleSplashLoaded = () => {
    setIsLoading(false); // Hide the splash screen
  };

  // Show the splash screen while loading
  if (isLoading) {
    return <SplashScreen onLoaded={handleSplashLoaded} />;
  }

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.tealGreen, // Active tab color
          tabBarInactiveTintColor: colors.paleSilver, // Inactive tab color
          tabBarLabelStyle: styles.tabBarLabel, // Tab label style
          headerStyle: styles.header, // Style for the top bar
          headerTintColor: colors.paleSilver, // Color of the text/icons in the header
          headerTitleStyle: styles.headerTitle, // Title style in the header
        }}
      >
        <Tab.Screen
          name="Pass 1"
          component={Pass1Screen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="filter-1" size={24} color={color} />
            ),
            title: 'Pass 1', // Custom title for the top bar
          }}
        />
        <Tab.Screen
          name="Pass 2"
          component={Pass2Screen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="filter-2" size={24} color={color} />
            ),
            title: 'Pass 2 ', // Custom title for the top bar
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const colors = {
  midnightBlue: '#0b1133',   // Background, header
  tealGreen: '#00a896',      // Active tab, buttons
  paleSilver: '#fff3f3',     // Inactive tab, secondary text
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.midnightBlue, // Tab bar background
    borderTopWidth: 0, // Remove border for a sleek look
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: colors.midnightBlue, // Background color for the top bar
    shadowColor: 'transparent', // Removes shadow on iOS
    elevation: 0, // Removes shadow on Android
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.paleSilver, // Color for the title text in the top bar
  },
});
