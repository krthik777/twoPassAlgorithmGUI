import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { runPass1 } from '../utils/pass1';

export default function Pass1Screen() {
    const [assemblyCode, setAssemblyCode] = useState('');
    const [optab, setOptab] = useState('');
    const [intermediateFile, setIntermediateFile] = useState([]);
    const [symtab, setSymtab] = useState([]);

    const handleFileUpload = async (setField) => {
        if (Platform.OS === 'ios') { // Only allow file upload for iOS
            try {
                const result = await DocumentPicker.getDocumentAsync({
                    type: 'text/plain',
                });
                // Alert the result for debugging
                console.log(result);

                // Check if the result type is 'success' and if uri is not null
                if (result.type === 'success' && result.uri) {
                    // Use FileSystem to read file content
                    const fileContent = await FileSystem.readAsStringAsync(result.uri);
                    setField(fileContent); // Set the file content into the text input
                } else {
                    alert('No file selected or an error occurred.');
                }
            } catch (error) {
                alert('An error occurred while selecting the file: ' + error.message);
            }
        } else if (Platform.OS === 'web') {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'text/plain';

            fileInput.onchange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const fileContent = e.target.result;
                        setField(fileContent);
                    };
                    reader.readAsText(file);
                } else {
                    alert('Error: No file selected.');
                }
            };
            fileInput.click();
        }
    };

    const handlePass1 = () => {
        try {
            const { intermediateFile, symtab } = runPass1(assemblyCode, optab);
            setIntermediateFile(intermediateFile); // Keeping as an array
            setSymtab(symtab); // Keeping as an array
        } catch (error) {
            alert(error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TextInput
                multiline
                numberOfLines={10}
                placeholder="Assembly Code"
                value={assemblyCode}
                onChangeText={setAssemblyCode}
                style={styles.textInput}
                placeholderTextColor={colors.paleSilver}
            />

            {/* Conditionally render the upload button for assembly code */}
            {Platform.OS !== 'android' && (
                <TouchableOpacity onPress={() => handleFileUpload(setAssemblyCode)} style={styles.button}>
                    <Text style={styles.buttonText}>Upload Assembly Code</Text>
                </TouchableOpacity>
            )}

            <TextInput
                multiline
                numberOfLines={10}
                placeholder="Optab"
                value={optab}
                onChangeText={setOptab}
                style={styles.textInput}
                placeholderTextColor={colors.paleSilver}
            />

            {/* Conditionally render the upload button for optab */}
            {Platform.OS !== 'android' && (
                <TouchableOpacity onPress={() => handleFileUpload(setOptab)} style={styles.button}>
                    <Text style={styles.buttonText}>Upload Optab</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handlePass1} style={styles.button}>
                <Text style={styles.buttonText}>Run Pass 1</Text>
            </TouchableOpacity>

            {/* Intermediate File Table */}
            <Text style={styles.sectionTitle}>Intermediate File:</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>LOC</Text>
                <Text style={styles.tableHeaderText}>Label</Text>
                <Text style={styles.tableHeaderText}>Opcode</Text>
                <Text style={styles.tableHeaderText}>Operand</Text>
                <Text style={styles.tableHeaderText}>Object Code</Text>
            </View>
            {intermediateFile.map((line, index) => {
                const [loc, label, opcode, operand, objectCode] = line.split(/\t+/);
                return (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{loc || ''}</Text>
                        <Text style={styles.tableCell}>{label !== '-' ? label : ''}</Text>
                        <Text style={styles.tableCell}>{opcode || ''}</Text>
                        <Text style={styles.tableCell}>{operand || ''}</Text>
                        <Text style={styles.tableCell}>{objectCode || ''}</Text>
                    </View>
                );
            })}

            {/* Symtab File Table */}
            <Text style={styles.sectionTitle}>Symtab File:</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Label</Text>
                <Text style={styles.tableHeaderText}>Address</Text>
            </View>
            {symtab.map((entry, index) => {
                const [label, address] = entry.split(/\t+/);
                return (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{label || ''}</Text>
                        <Text style={styles.tableCell}>{address || ''}</Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const colors = {
  midnightBlue: '#1b1f3b',   // Background, header
  amethyst: '#394078',       // Accent or highlight
  mintCream: '#edf7fa',      // Light background, text
  tealGreen: '#00a896',      // Buttons, links
  paleSilver: '#c8c8c8'      // Secondary text
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.midnightBlue, // Main background color
        padding: 20,
    },
    textInput: {
        borderColor: colors.paleSilver,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        color: colors.mintCream,  // Text color
        backgroundColor: colors.amethyst, // Light background for inputs
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: colors.mintCream,
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        marginTop: 10,
    },
    tableHeaderText: {
        width: '20%',
        fontWeight: 'bold',
        color: colors.mintCream,
    },
    tableRow: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    tableCell: {
        width: '20%',
        color: colors.mintCream, // Light text for table cells
    },
    button: {
        backgroundColor: colors.tealGreen,
        paddingVertical: 12,   // Vertical padding for button height
        paddingHorizontal: 25, // Horizontal padding for button width
        color: colors.mintCream,
        borderRadius: 25,      // More pronounced curve (half of paddingHorizontal for oval shape)
        elevation: 3,          // Add shadow for Android
        shadowColor: '#000',   // iOS shadow
        shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
        shadowOpacity: 0.25,   // iOS shadow opacity
        shadowRadius: 3.84,    // iOS shadow radius
        alignItems: 'center',  // Center the text inside the button
        marginBottom: 15,      // Add spacing between buttons
    },
    buttonText: {
        color: colors.mintCream,
        fontWeight: 'bold',
    }
});
