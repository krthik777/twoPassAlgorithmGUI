import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useFonts } from 'expo-font'; // If using Expo, otherwise use appropriate font loading method

const SplashScreen: React.FC<{ onLoaded: () => void }> = ({ onLoaded }) => {
  const [visible, setVisible] = useState(true);
  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('../assets/fonts/SpaceMono-Regular.ttf'), // Custom font file
  });

  const fadeAnim = new Animated.Value(0); // Initial opacity value
  const translateY = new Animated.Value(-50); // Initial Y translation value

  useEffect(() => {
    if (fontsLoaded) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          delay: 1000, // Delay before fading out
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        onLoaded();
      });
    }
  }, [fontsLoaded, fadeAnim, translateY, onLoaded]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.textContainer,
          { opacity: fadeAnim, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.text}>Two Pass Algorithms</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Background color of the splash screen
  },
  textContainer: {
    // Additional container styling if needed
  },
  text: {
    fontSize: 28,
    color: '#333333', // Text color
    fontFamily: 'Roboto-Bold', // Custom font family
    textAlign: 'center',
  },
});

export default SplashScreen;
