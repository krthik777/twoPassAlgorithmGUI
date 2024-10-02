import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Alert, Platform, StyleSheet } from 'react-native';
import { runPass2 } from '../utils/pass2'; // Import the runPass2 function from pass2/utils/pass2.js

export default function Pass2Screen() {
    const [assemblyCode, setAssemblyCode] = useState('');
    const [optab, setOptab] = useState('');
    const [finalOutput, setFinalOutput] = useState([]);
    const [recordFile, setRecordFile] = useState([]);

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

    // Combine all components into a single list for rendering
    const renderItem = ({ item }) => {
        if (item.type === 'input') {
            return (
                <TextInput
                    placeholder={item.placeholder}
                    value={item.value}
                    onChangeText={item.onChangeText}
                    style={styles.textInput}
                    multiline
                />
            );
        }
        if (item.type === 'button') {
            return (
                <TouchableOpacity onPress={item.onPress} style={styles.button}>
                    <Text style={styles.buttonText}>{item.label}</Text>
                </TouchableOpacity>
            );
        }
        if (item.type === 'tableHeader') {
            return <Text style={styles.tableHeader}>{item.label}</Text>;
        }
        if (item.type === 'flatList') {
            return (
                <FlatList
                    data={item.data}
                    renderItem={item.renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.table}
                />
            );
        }
        return null;
    };

    const data = [
        {
            type: 'input',
            placeholder: 'Enter Assembly Code',
            value: assemblyCode,
            onChangeText: setAssemblyCode,
        },
        // Conditionally render upload button for assembly code on web only
        ...(Platform.OS === 'web' ? [{
            type: 'button',
            label: 'Upload Assembly Code',
            onPress: () => handleUpload(setAssemblyCode),
        }] : []),
        {
            type: 'input',
            placeholder: 'Enter Opcode Table (Optab)',
            value: optab,
            onChangeText: setOptab,
        },
        // Conditionally render upload button for optab on web only
        ...(Platform.OS === 'web' ? [{
            type: 'button',
            label: 'Upload Optab',
            onPress: () => handleUpload(setOptab),
        }] : []),
        {
            type: 'button',
            label: 'Run Pass 2',
            onPress: handlePass2,
        },
        {
            type: 'tableHeader',
            label: 'Final Output',
        },
        {
            type: 'flatList',
            data: finalOutput,
            renderItem: renderTableRow,
        },
        {
            type: 'tableHeader',
            label: 'Record File',
        },
        {
            type: 'flatList',
            data: recordFile,
            renderItem: ({ item }) => <Text style={styles.recordFileRow}>{item.content}</Text>,
        },
    ];

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.container}
        />
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
        padding: 20,
        backgroundColor: colors.midnightBlue,
    },
    textInput: {
        borderColor: colors.paleSilver,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        height: 150,
        backgroundColor: colors.amethyst,
        color: colors.mintCream,
    },
    table: {
        marginVertical: 20,
        // Removed borderWidth and borderColor for invisibility
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
        // Removed borderBottomWidth and borderBottomColor for invisibility
    },
    tableCell: {
        color: colors.mintCream,
        flex: 1,
        textAlign: 'center',
    },
    outputInput: {
        borderColor: colors.paleSilver,
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
        height: 150,
        backgroundColor: colors.amethyst,
        color: colors.mintCream,
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
    recordFile: {
        marginVertical: 10,
        padding: 5,
        // Removed borderWidth and borderColor for invisibility
        backgroundColor: colors.amethyst,
    },
    recordFileRow: {
        color: colors.mintCream,
        paddingVertical: 5,
    },
});
