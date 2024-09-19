export const performPass2 = (code, symbolTable) => {
    const lines = code.split('\n');
    let machineCode = '';
  
    const parsedSymbolTable = JSON.parse(symbolTable); // Convert symbol table string to object
  
    lines.forEach((line) => {
      const parts = line.trim().split(' ');
      if (parsedSymbolTable[parts[0]]) {
        machineCode += `ADDR${parsedSymbolTable[parts[0]]} `; // Replace symbol with address
      }
      machineCode += 'INST ' + parts.slice(1).join(' ') + '\n'; // Add machine instruction
    });
  
    return machineCode;
  };
  