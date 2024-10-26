export const runPass1 = (assemblyCode, optab) => {
    const intermediateFile = [];
    const symtab = [];

    const lines = assemblyCode.split('\n');
    const optabLines = optab.split('\n');

    // Process Optab
    const optabMap = {};
    optabLines.forEach(line => {
        const [mnemonic, opcode] = line.split(/\s+/);
        if (mnemonic && opcode) {
            optabMap[mnemonic] = opcode;
        }
    });

    let locctr = 0x1000; // Starting location counter

    lines.forEach(line => {
        // Split line into label, opcode, and operand
        const parts = line.trim().split(/\s+/);
        let label = '-', opcode, operand;

        if (parts.length === 3) {
            [label, opcode, operand] = parts;
        } else if (parts.length === 2) {
            [opcode, operand] = parts;
        }

        if (opcode === 'START') {
            locctr = parseInt(operand, 16);
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t-`);
        } else if (optabMap[opcode]) {
            intermediateFile.push(`${locctr.toString(16)}\t${label !== '-' ? label : '-'}\t${opcode}\t${operand}\t${optabMap[opcode]}`);
            
            // Add the label to symtab if present
            if (label !== '-') {
                symtab.push(`${label}\t${locctr.toString(16)}`);
            }
            
            locctr += 3; // Assuming each instruction is 3 bytes
        } else if (opcode === 'WORD') {
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t${parseInt(operand).toString(16).padStart(6, '0')}`);
            
            if (label !== '-') {
                symtab.push(`${label}\t${locctr.toString(16)}`);
            }
            
            locctr += 3;
        } else if (opcode === 'BYTE') {
            const byteValue = operand.match(/C'(.*)'/)[1].split('').map(c => c.charCodeAt(0).toString(16)).join('');
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t${byteValue}`);
            
            if (label !== '-') {
                symtab.push(`${label}\t${locctr.toString(16)}`);
            }
            
            locctr += byteValue.length / 2;
        } else if (opcode === 'RESB' || opcode === 'RESW') {
            intermediateFile.push(`${locctr.toString(16)}\t${label}\t${opcode}\t${operand}\t-`);
            
            if (label !== '-') {
                symtab.push(`${label}\t${locctr.toString(16)}`);
            }
            
            locctr += opcode === 'RESB' ? parseInt(operand, 10) : parseInt(operand, 10) * 3;
        } else if (opcode === 'END') {
            intermediateFile.push(`${locctr.toString(16)}\t-\t${opcode}\t${operand}\t-`);
        }
    });

    return {
        intermediateFile,
        symtab
    };
};
