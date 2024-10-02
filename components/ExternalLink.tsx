import React from 'react';
import { Linking, Platform, TouchableOpacity, Text } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: object;
};

export function ExternalLink({ href, children, style }: Props) {
  const navigation = useNavigation();

  const handlePress = async () => {
    if (Platform.OS === 'web') {
      // Use the default browser on web
      window.open(href, '_blank');
    } else {
      // Open the link in an in-app browser on mobile platforms
      await openBrowserAsync(href);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}
