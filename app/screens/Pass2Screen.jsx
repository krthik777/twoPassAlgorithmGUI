import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Alert, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { runPass2 } from '../utils/pass2'; // Import the runPass2 function from pass2/utils/pass2.js

export default function Pass2Screen() {
    const [assemblyCode, setAssemblyCode] = useState('');
    const [optab, setOptab] = useState('');
    const [finalOutput, setFinalOutput] = useState([]);
    const [recordFile, setRecordFile] = useState([]);

    const { width } = useWindowDimensions(); // Get screen width

    const handleFileUploadWeb = (event, setField) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setField(e.target.result);
                alert('File uploaded successfully!');
            };
            reader.readAsText(file);
        } else {
            alert('File not uploaded!');
        }
    };

    const handlePass2 = () => {
        try {
            const { finalOutput, recordFile } = runPass2(assemblyCode, optab);

            // Convert finalOutput and recordFile from string to arrays
            setFinalOutput(finalOutput.map(row => ({ id: row[0], label: row[1], opcode: row[2], operand: row[3], objectCode: row[4] })));
            setRecordFile(recordFile.map((row, index) => ({ id: index.toString(), content: row }))); // Use index as ID
        } catch (error) {
            alert(error);
        }
    };

    const handleUpload = (setField) => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt';
            input.onchange = (event) => handleFileUploadWeb(event, setField);
            input.click();
        } else {
            alert("File upload is only available on the web.");
        }
    };

    const renderTableRow = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.id || '-'}</Text>
            <Text style={styles.tableCell}>{item.label || '-'}</Text>
            <Text style={styles.tableCell}>{item.opcode || '-'}</Text>
            <Text style={styles.tableCell}>{item.operand || '-'}</Text>
            <Text style={styles.tableCell}>{item.objectCode || '-'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Conditionally adjust the layout for web and wide screens */}
            <View style={[styles.inputContainer, Platform.OS === 'web' && width > 768 ? styles.row : styles.column]}>
                {/* Assembly Code input and button */}
                <View style={styles.inputGroup}>
                    <TextInput
                        placeholder="Enter Assembly Code"
                        value={assemblyCode}
                        onChangeText={setAssemblyCode}
                        style={styles.textInput}
                        multiline
                    />
                    {Platform.OS === 'web' && (
                        <TouchableOpacity onPress={() => handleUpload(setAssemblyCode)} style={styles.button}>
                            <Text style={styles.buttonText}>Upload Assembly Code</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Optab input and button */}
                <View style={styles.inputGroup}>
                    <TextInput
                        placeholder="Enter Opcode Table (Optab)"
                        value={optab}
                        onChangeText={setOptab}
                        style={styles.textInput}
                        multiline
                    />
                    {Platform.OS === 'web' && (
                        <TouchableOpacity onPress={() => handleUpload(setOptab)} style={styles.button}>
                            <Text style={styles.buttonText}>Upload Optab</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Run Pass 2 Button */}
            <TouchableOpacity onPress={handlePass2} style={styles.button}>
                <Text style={styles.buttonText}>Run Pass 2</Text>
            </TouchableOpacity>

            {/* Final Output */}
            <Text style={styles.tableHeader}>Final Output</Text>
            <FlatList
                data={finalOutput}
                renderItem={renderTableRow}
                keyExtractor={(item) => item.id}
                style={styles.table}
                contentContainerStyle={styles.listContent} // Ensure list takes the full width and background color
            />

            {/* Record File */}
            <Text style={styles.tableHeader}>Record File</Text>
            <FlatList
                data={recordFile}
                renderItem={({ item }) => <Text style={styles.recordFileRow}>{item.content}</Text>}
                keyExtractor={(item) => item.id}
                style={styles.table}
                contentContainerStyle={styles.listContent} // Ensure list takes the full width and background color
            />
        </View>
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
        flex: 1, // Take the full height of the screen
        padding: 20,
        backgroundColor: colors.midnightBlue,
        
    },
    inputContainer: {
        marginBottom: 20,
        
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
    },
    inputGroup: {
        flex: 1,
        marginHorizontal: 10,
    },
    textInput: {
        borderColor: colors.paleSilver,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        height: 200,
        backgroundColor: colors.amethyst,
        color: colors.mintCream,
        borderRadius: 10,
    },
    button: {
        backgroundColor: colors.tealGreen,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: colors.mintCream,
        fontWeight: 'bold',
    },
    table: {
        marginVertical: 20,
        backgroundColor: colors.midnightBlue, // Ensure background matches the overall UI
    },
    listContent: {
        flexGrow: 1,
        backgroundColor: colors.midnightBlue, // Background for the content of the list
    },
    tableHeader: {
        color: colors.mintCream,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    tableCell: {
        color: colors.mintCream,
        flex: 1,
        textAlign: 'center',
    },
    recordFileRow: {
        color: colors.mintCream,
        paddingVertical: 5,
    },
});
