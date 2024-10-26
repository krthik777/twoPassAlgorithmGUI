export function runAssembler(assemblyCode, optab) {
    const intermediateFile = [];
    const symtab = new Map();
    const finalOutput = [];
    const recordFile = [];
    const optabMap = {};

    const lines = assemblyCode.split('\n').map(line => line.trim()).filter(Boolean);
    const optabLines = optab.split('\n');

    // Build optab map for opcode to hex code mappings
    optabLines.forEach(line => {
        const [mnemonic, code] = line.trim().split(/\s+/);
        optabMap[mnemonic] = code;
    });

    let locctr = 0x1000; // Starting location counter for Pass 1
    let startingAddress = locctr;
    let currentAddress = locctr;

    // Pass 1: Build the intermediate file and symbol table
    lines.forEach(line => {
        const parts = line.split(/\s+/);
        const [label, opcode, operand] = parts.length === 3 ? parts : ['-', parts[0], parts[1]];

        if (opcode === 'START') {
            locctr = parseInt(operand, 16);
            startingAddress = locctr;
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t-`);
        } else if (optabMap[opcode]) {
            if (label !== '-') symtab.set(label, locctr.toString(16));
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t${optabMap[opcode]}`);
            locctr += 3; // Instruction length is assumed to be 3 bytes
        } else if (opcode === 'WORD') {
            if (label !== '-') symtab.set(label, locctr.toString(16));
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t${parseInt(operand).toString(16).padStart(6, '0')}`);
            locctr += 3;
        } else if (opcode === 'BYTE') {
            const byteValue = operand.match(/C'(.*)'/)[1].split('').map(c => c.charCodeAt(0).toString(16)).join('');
            if (label !== '-') symtab.set(label, locctr.toString(16));
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t${byteValue}`);
            locctr += byteValue.length / 2;
        } else if (opcode === 'RESB' || opcode === 'RESW') {
            if (label !== '-') symtab.set(label, locctr.toString(16));
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t-`);
            locctr += opcode === 'RESB' ? parseInt(operand, 10) : parseInt(operand, 10) * 3;
        } else if (opcode === 'END') {
            intermediateFile.push(`${locctr.toString(16)}\t-\t${opcode}\t${operand}\t-`);
        }
    });

    // Header Record
    const programName = lines[0].split(/\s+/)[0].padEnd(6, ' ');
    const programLength = (locctr - startingAddress).toString(16).padStart(6, '0');
    recordFile.push(`H^${programName}^${startingAddress.toString(16).toUpperCase().padStart(6, '0')}^${programLength}`);

    // Pass 2: Generate the final output and record file
    let currentTextRecord = '';
    let textRecordAddress = '';
    let textRecordLength = 0;

    intermediateFile.forEach(line => {
        const [address, label, opcode, operand, objCode] = line.split('\t');
        let objectCode = objCode;

        if (opcode === 'START') {
            finalOutput.push(['-', label, opcode, operand, '-']);
        } else if (opcode === 'END') {
            if (currentTextRecord) {
                recordFile.push(`T^${textRecordAddress.toUpperCase()}^${textRecordLength.toString(16).padStart(2, '0').toUpperCase()}${currentTextRecord}`);
            }
            finalOutput.push([address, '-', label, opcode, operand]);
            recordFile.push(`E^${symtab.get(operand) || startingAddress.toString(16).toUpperCase().padStart(6, '0')}`);
        } else {
            if (optabMap[opcode]) {
                if (symtab.has(operand)) {
                    objectCode += symtab.get(operand).padStart(4, '0');
                } else {
                    objectCode += "0000"; // default to 0000 if symbol not found
                }
                finalOutput.push([address, label, opcode, operand, objectCode]);
            } else if (opcode === 'WORD') {
                objectCode = parseInt(operand).toString(16).padStart(6, '0');
                finalOutput.push([address, label, opcode, operand, objectCode]);
            } else if (opcode === 'BYTE') {
                const byteValue = operand.match(/C'(.*)'/)[1].split('').map(c => c.charCodeAt(0).toString(16)).join('');
                finalOutput.push([address, label, opcode, operand, byteValue]);
            } else if (opcode === 'RESW' || opcode === 'RESB') {
                finalOutput.push([address, label, opcode, operand, '-']);
            }

            // Handle Text Record
            if (objectCode !== '-' && objectCode) {
                if (!currentTextRecord) {
                    textRecordAddress = address;
                }
                if (textRecordLength + objectCode.length / 2 > 30) {
                    recordFile.push(`T^${textRecordAddress.toUpperCase()}^${textRecordLength.toString(16).padStart(2, '0').toUpperCase()}${currentTextRecord}`);
                    currentTextRecord = objectCode;
                    textRecordAddress = address;
                    textRecordLength = objectCode.length / 2;
                } else {
                    currentTextRecord += `^${objectCode}`;
                    textRecordLength += objectCode.length / 2;
                }
            }
        }
    });

    return {
        intermediateFile,
        symtab: Array.from(symtab.entries()).map(([symbol, addr]) => `${symbol}\t${addr}`),
        finalOutput,
        recordFile
    };
}
