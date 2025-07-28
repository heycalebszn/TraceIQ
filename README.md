## Trace IQ - Julia OS

## 🚀 Features

### 🔥 Hero Section

- Beautiful background interaction (`HeroHighlight`) using radial hover effects.
- Eye-catching gradient highlight animations (`Highlight`).

### 💡 How It Works

- **Step-by-step explanation** of the agent’s process:
  - 🧠 Agent Activated – Reads and analyzes the transaction hash.
  - 🔍 Path Traced – Follows the transaction across wallets, bridges, and mixers.
  - 📊 Risk Scored – Returns a summary with suspicious activity flags.

### 🧾 Transaction Hash Input

- Custom animated input field (`PlaceholdersAndVanishInput`)
- Cycles through placeholder suggestions with smooth transitions.
- Disintegrating canvas effect when user hits Enter/Submit.

### 📈 Result Section (After Analysis)

- Conditionally rendered after input and analysis trigger.
- Includes:
  - **Transaction Details** (from, to, token, value)
  - **Agent Summary** (AI-generated conclusion)
  - **Graph Visualization** using `@xyflow/react`
  - **Loading Spinner** for realistic feedback
  - **Download Report** button (PDF/JSON download support soon)

### 🧠 Transaction Graph

- Built with `React Flow` (via `@xyflow/react`)
- Displays sample flow of transaction path with animations
- Fully customizable and ready for dynamic data

### 🧾 Download Report

- Placeholder for exporting results as PDF or JSON
- Mock button provided (`alert`) — ready to be connected to real export logic

### ❤️ Footer

- Simple, clean footer:
  > _Made with ❤️ by Julia OS._
