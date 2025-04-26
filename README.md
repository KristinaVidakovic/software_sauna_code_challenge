# 🧖‍♀️ Software Sauna Code Challenge

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/TESTED%20WITH-JEST-99424f?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Nodemon](https://img.shields.io/badge/Dev-Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)](https://www.npmjs.com/package/nodemon)

---

## 📜 Description

This project is a solution for the **Software Sauna Code Challenge**.  
The task is to navigate through a map of characters, **collect letters**, and **follow the correct path**.

- ➡️ Start at the character `@`
- 🛤️ Follow the path using allowed characters
- ✉️ Collect any letters along the way
- 🛑 Stop when reaching the character `x`

The project is developed with **TypeScript**, features a clean architecture, and comes with a full set of **automated tests** using **Jest**.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
  npm install
```
### 2. Run the Application

```bash
  npm run dev -- -f examples/valid_map_6.txt
```
> 📂 Replace `examples/valid_map_6.txt` with the path to the map file you want to use.

---

### 🗺️ Example Input
Example content of a map file:
```bash
  @---A---+
          |
  x-B-+   C
      |   |
      +---+
```      
### 🧹 Example Output
```bash
  Letters: ACB
  Path: @---A---+|C|+---+|+-B-x
``` 
---

## 📂 Available Scripts

| Command                | Description                                          |
|------------------------|------------------------------------------------------|
| `npm run dev`           | Run the app in development mode (with nodemon)       |
| `npm run test`          | Run all tests with Jest                              |
| `npm run test:coverage` | Run tests and generate a coverage report             |
| `npm run test:watch`    | Watch files and run tests automatically on changes   |

--- 

## 🏗️ Project Structure

- `src/`
    - `app.ts`                           # Core application logic
    - `index.ts`                         # Entry point (CLI handler)
    - `enums/`
        - `direction.enum.ts`             # Direction enum
    - `interfaces/`
        - `final-path.interface.ts`       # Final path result interface
        - `position.interface.ts`         # Position tracking interface
        - `step.interface.ts`             # Step interface for moves
    - `tests/`
        - `app.spec.ts`                   # Tests for main app flow
        - `helpers.spec.ts`               # Tests for utility functions
    - `utils/`
        - `constants.ts`                  # Common constants
        - `errors.ts`                     # Error definitions
        - `helpers.ts`                    # Helper functions
    - `assets/`
        - `demo.gif`                      # Running application using CLI demo
        - `demo-test.gif`                 # Running tests with coverage demo
        - `dependences.png`               # Screenshot: installed dependencies
        - `test-coverage-1.png`           # Screenshot: helpers tests
        - `test-coverage-2.png`           # Screenshot: app tests
        - `test-coverage-3.png`           # Screenshot: overall coverage
- `examples/`                          # Sample map files

---

## ✅ Testing

This project uses **Jest** for testing.

You can run the tests with the following command:

```bash
  npm run test
```

To generate a **test coverage report**, run:

```bash
  npm run test:coverage
```

You can find screenshots of the test results and coverage reports inside the `src/assets/` folder:

- 📸 `dependences.png` — Installed dependencies
- 📸 `test-coverage-1.png` — Tests for helpers.ts
- 📸 `test-coverage-2.png` — Tests for main app flow
- 📸 `test-coverage-3.png` — Overall test coverage

---

## 🎥 Demo

Running app using CLI

![App Running Demo](assets/demo.gif)

Running tests

![Test Running](assets/demo-test.gif)

---
## 👩‍💻 Author
Made by Kristina Vidaković.

- 📧 Email: [kristina.vidakovic403@gmail.com](mailto:kristina.vidakovic403@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/kvidakovic](https://www.linkedin.com/in/kvidakovic/)
