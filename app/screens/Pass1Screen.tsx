import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { performPass1 } from '../utils/pass1';

const Pass1Screen = () => {
  const [inputCode, setInputCode] = useState('');
  const [pass1Result, setPass1Result] = useState('');

  const handlePass1 = () => {
    const symbolTable = performPass1(inputCode);
    setPass1Result(symbolTable);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your assembly code here"
        multiline
        value={inputCode}
        onChangeText={setInputCode}
      />
      <Button title="Run Pass 1" onPress={handlePass1} />
      {pass1Result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultHeader}>Symbol Table</Text>
          <Text style={styles.resultText}>{pass1Result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    height: 150,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  resultContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#e1f5fe',
    borderRadius: 5,
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
  },
});

export default Pass1Screen;
