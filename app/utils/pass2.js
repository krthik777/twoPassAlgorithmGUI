// Assuming runPass2 is defined in ../utils/pass2.js

export function runPass2(assemblyCode, optab) {
  const lines = assemblyCode.split('\n').map(line => line.trim()).filter(Boolean);
  const optabMap = {};

  // Create a map for optab
  optab.split('\n').forEach(line => {
      const [mnemonic, code] = line.trim().split(/\s+/);
      optabMap[mnemonic] = code;
  });

  let startingAddress = 0;
  const finalOutput = [];
  const recordFile = []; // Initialize the record file array
  let currentAddress = 0;

  // Store the program name for the header record
  const programName = lines[0].split(/\s+/)[0]; // Get program name from the first line

  // Process the assembly code
  lines.forEach(line => {
      const parts = line.split(/\s+/);
      const [label, opcode, operand] = parts.length === 3 ? parts : ['-', parts[0], parts[1]]; // Adjust for labels

      if (opcode === 'START') {
          startingAddress = parseInt(operand, 16);
          currentAddress = startingAddress;
          finalOutput.push(['-', label, opcode, operand, '-']);
      } else if (opcode === 'END') {
          finalOutput.push([currentAddress.toString(16).toUpperCase().padStart(4, '0'), '-', label, opcode, operand]);
          // End Record (E) should reference the starting address
          recordFile.push(`E^${startingAddress.toString(16).toUpperCase().padStart(6, '0')}`);
      } else {
          const opcodeHex = optabMap[opcode];
          let instructionLength = getInstructionLength(opcode, operand);
          let objectCode;

          if (opcodeHex) {
              objectCode = opcodeHex + currentAddress.toString(16).toUpperCase().padStart(6, '0').slice(2); // Use last 4 digits
              finalOutput.push([
                  currentAddress.toString(16).toUpperCase().padStart(4, '0'), // Address
                  '-', // Placeholder for a field that might be used later
                  opcode, // Opcode
                  operand, // Operand
                  objectCode // Object Code
              ]);
          } else {
              objectCode = '-';
              finalOutput.push([
                  currentAddress.toString(16).toUpperCase().padStart(4, '0'),
                  label,
                  opcode,
                  operand,
                  objectCode // Use '-' for non-opcode lines
              ]);
          }

          // Create or update Text Record (T)
          if (opcodeHex) {
              let textRecord = `T^${currentAddress.toString(16).toUpperCase().padStart(6, '0')}^`;
              const objectCodes = [objectCode];

              // Increment the address based on instruction length
              currentAddress += instructionLength;

              // Handle case for subsequent instructions
              while (instructionLength > 0) {
                  const nextLine = lines.find(line => line.includes(currentAddress.toString(16).toUpperCase()));
                  if (nextLine) {
                      const nextParts = nextLine.split(/\s+/);
                      const nextOpcode = nextParts[1];
                      const nextOperand = nextParts[2];
                      const nextOpcodeHex = optabMap[nextOpcode];
                      if (nextOpcodeHex) {
                          const nextObjectCode = nextOpcodeHex + currentAddress.toString(16).toUpperCase().padStart(6, '0').slice(2);
                          objectCodes.push(nextObjectCode);
                          currentAddress += getInstructionLength(nextOpcode, nextOperand);
                          instructionLength--;
                      }
                  } else {
                      break; // No more instructions to process
                  }
              }

              textRecord += objectCodes.join('^');
              recordFile.push(textRecord);
          }

          // Increment the address based on instruction length
          currentAddress += instructionLength;
      }

      // Handling directive lines
      if (label && !finalOutput.some(row => row[1] === label)) { // Avoid duplicates
          finalOutput.push([currentAddress.toString(16).toUpperCase().padStart(4, '0'), label, '-', '-', '-']);
      }
  });

  // Create the Header Record (H)
  const length = (currentAddress - startingAddress).toString(16).toUpperCase().padStart(6, '0'); // Calculate the length of the program
  recordFile.unshift(`H^${programName}^${startingAddress.toString(16).toUpperCase().padStart(6, '0')}^${length}`);

  return { finalOutput, recordFile }; // Return both finalOutput and recordFile
}

// Helper function to get instruction length
function getInstructionLength(opcode, operand) {
  if (opcode === 'RESB') return parseInt(operand); // Reserve bytes
  if (opcode === 'RESW') return parseInt(operand) * 3; // Reserve words (3 bytes each)
  if (opcode === 'BYTE') {
      // Assuming the operand format is C'...' for character literals
      return operand.startsWith("C'") ? (operand.length - 3) : 1; // 1 for BYTE of 1 byte value
  }
  return 3; // Default instruction length for others
}
