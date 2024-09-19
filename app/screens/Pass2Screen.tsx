import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { performPass2 } from '../utils/pass2';
import { performPass1 } from '../utils/pass1'; // To fetch the symbol table from Pass 1

const Pass2Screen = () => {
  const [inputCode, setInputCode] = useState('');
  const [symbolTable, setSymbolTable] = useState('');
  const [pass2Result, setPass2Result] = useState('');

  const handlePass2 = () => {
    const generatedSymbolTable = performPass1(inputCode);
    setSymbolTable(generatedSymbolTable);

    const machineCode = performPass2(inputCode, generatedSymbolTable);
    setPass2Result(machineCode);
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
      <Button title="Run Pass 2" onPress={handlePass2} />
      {pass2Result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultHeader}>Machine Code</Text>
          <Text style={styles.resultText}>{pass2Result}</Text>
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

export default Pass2Screen;
