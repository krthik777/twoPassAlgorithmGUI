import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { runAssembler } from "../utils/pass2";

export default function Pass2Screen() {
  const [assemblyCode, setAssemblyCode] = useState("");
  const [optab, setOptab] = useState("");
  const [finalOutput, setFinalOutput] = useState([]);
  const [recordFile, setRecordFile] = useState([]);

  const { width } = useWindowDimensions();

  const handleFileUploadWeb = (event, setField) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setField(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("File not uploaded!");
    }
  };

  const handlePass2 = () => {
    try {
      const { finalOutput, recordFile } = runAssembler(assemblyCode, optab);

      setFinalOutput(
        finalOutput.map((row) => ({
          id: row[0],
          label: row[1],
          opcode: row[2],
          operand: row[3],
          objectCode: row[4],
        }))
      );
      setRecordFile(
        recordFile.map((row, index) => ({ id: index.toString(), content: row }))
      );
    } catch (error) {
      alert(error);
    }
  };

  const handleUpload = (setField) => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt";
      input.onchange = (event) => handleFileUploadWeb(event, setField);
      input.click();
    } else {
      alert("File upload is only available on the web.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={[
          styles.inputContainer,
          Platform.OS === "web" && width > 768 ? styles.row : styles.column,
        ]}
      >
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Enter Assembly Code"
            value={assemblyCode}
            onChangeText={setAssemblyCode}
            style={styles.textInput}
            multiline
          />
          {Platform.OS === "web" && (
            <TouchableOpacity
              onPress={() => handleUpload(setAssemblyCode)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Upload Assembly Code</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Enter Opcode Table (Optab)"
            value={optab}
            onChangeText={setOptab}
            style={styles.textInput}
            multiline
          />
          {Platform.OS === "web" && (
            <TouchableOpacity
              onPress={() => handleUpload(setOptab)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Upload Optab</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={handlePass2} style={styles.button}>
        <Text style={styles.buttonText}>Run Pass 2</Text>
      </TouchableOpacity>

      <Text style={styles.tableHeader}>Final Output</Text>
      <View style={styles.table}>
        {finalOutput.map((item) => (
          <View style={styles.tableRow} key={item.id}>
            <Text style={styles.tableCell}>{item.id || "-"}</Text>
            <Text style={styles.tableCell}>{item.label || "-"}</Text>
            <Text style={styles.tableCell}>{item.opcode || "-"}</Text>
            <Text style={styles.tableCell}>{item.operand || "-"}</Text>
            <Text style={styles.tableCell}>{item.objectCode || "-"}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.tableHeader}>Record File</Text>
      <View style={styles.table}>
        {recordFile.map((item) => (
          <Text style={styles.recordFileRow} key={item.id}>
            {item.content}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const colors = {
  midnightBlue: "#1b1f3b",
  amethyst: "#394078",
  mintCream: "#edf7fa",
  tealGreen: "#00a896",
  paleSilver: "#c8c8c8",
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.midnightBlue,
  },
  inputContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
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
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: colors.mintCream,
    fontWeight: "bold",
  },
  table: {
    marginVertical: 20,
    backgroundColor: colors.midnightBlue,
  },
  tableHeader: {
    color: colors.mintCream,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  tableCell: {
    color: colors.mintCream,
    flex: 1,
    textAlign: "center",
  },
  recordFileRow: {
    color: colors.mintCream,
    paddingVertical: 5,
  },
});
