# Two Pass Algorithm Implementation 👋

This is a React Native project developed using [Expo](https://expo.dev) to demonstrate the implementation of **Pass 1** and **Pass 2** algorithms. The project features two screens where each pass is calculated and displayed on different tabs.

## What is the Two Pass Algorithm?

The **Two Pass Algorithm** is commonly used in assemblers and compilers to process source code in two stages:

1. **Pass 1**:
   - It scans the source code and gathers essential information (like symbols and their addresses).
   - Generates a symbol table and sets up the memory locations.
   - It doesn't generate the final output but prepares the necessary data for **Pass 2**.
   
2. **Pass 2**:
   - It uses the information gathered in **Pass 1** to generate the final object code.
   - It resolves references and ensures the correct machine code or assembly instructions are generated.

This project focuses on simulating this two-pass processing logic through a simple user interface built with React Native.

## Get Started

To get started with this project, follow these steps:

1. Install the dependencies:

   ```bash
   npm install

2.Start the app:

   ```bash
   npx expo start

