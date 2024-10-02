import { Platform } from 'react-native';

// Web-specific function to read file content using FileReader
const readFileContentWeb = async (file) => {
  try {
    // Fetch the file from the URI if it isn't already a Blob or File
    const response = await fetch(file.uri);
    const blob = await response.blob(); // Convert the file into a Blob

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('File content (web):', event.target.result); // Debugging: Log content
        resolve(event.target.result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(blob); // Read the file as text from the Blob
    });
  } catch (error) {
    console.error('Error reading file on web:', error);
    throw error;
  }
};

// Native-specific file reading using expo-file-system
import * as FileSystem from 'expo-file-system';

const readFileContent = async (file) => {
  try {
    if (Platform.OS === 'web') {
      // Web-specific file handling
      return await readFileContentWeb(file);
    } else {
      // Native-specific file handling
      const fileUri = file.uri;
      const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8, // Ensure UTF-8 encoding
      });
      console.log('File content (native):', content); // Debugging: Log content
      return content;
    }
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

// Ensure both functions are exported
export { readFileContent, readFileContentWeb };
