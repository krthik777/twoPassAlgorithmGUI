export const performPass1 = (code) => {
    const lines = code.split('\n');
    let locationCounter = 0;
    let symbolTable = {};
  
    lines.forEach((line) => {
      const parts = line.trim().split(' ');
      if (parts.length > 1 && !symbolTable[parts[0]]) {
        symbolTable[parts[0]] = locationCounter;
      }
      locationCounter += 1; // Increment based on instruction size (simplified)
    });
  
    return JSON.stringify(symbolTable, null, 2); // Return symbol table
  };
  