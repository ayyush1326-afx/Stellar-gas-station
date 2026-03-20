# 🚀 Stellar Gas-Station

A high-performance "Refuel" dashboard designed for developers within the Stellar ecosystem. This application allows users to manage their Testnet XLM, request funding via the Official Stellar Friendbot, and trace on-chain activity through a Soroban smart contract.

---

## 📈 Evolution: Level 1 ➔ Level 2

This repository has been upgraded from a minimalist "White Belt" project (Level 1) to a full-featured "Yellow Belt" dApp (Level 2).

### 🚀 Enhancements & Advancements
- **Multi-Wallet Architecture**: Migrated from a single-wallet (Freighter) dependency to the robust `@creit-tech/stellar-wallets-kit`, now supporting **Freighter, Albedo, and xBull** wallets.
- **On-Chain Persistence**: Introduced a **Soroban Smart Contract (Global Fuel Ledger)** written in Rust to track fuel deposits on-chain, moving beyond simple balance fetching.
- **Real-time Synchronization**: Implemented **Stellar RPC Event Listening**; the UI now automatically updates whenever a `refuel` event is detected on the network.
- **Industrial Terminal UI**: Refactored the interface with a "Cyber-Terminal" aesthetic, including transaction status tracking (Idle -> Processing -> Success/Fail).

---

## 📺 Demo Video
Watch the full automated walkthrough of the Level 2 application in action:

![Stellar Gas-Station Demo](screenshots/demo_recording.webp)

---

## ✨ Features

### 🧪 Level 2: The Global Fuel Ledger
- **🔐 Multi-Wallet Support**: Secure authentication supporting multiple ecosystem wallets.
- **📜 Smart Contract Storage**: A custom Rust contract that tracks CRT fuel units per user.
- **🔄 Live Event Sync**: Automatic UI triggers based on on-chain contract events.
- **🚥 Transaction Status**: Visual feedback for complex contract invocations.

### 🕹️ Level 1: Core Refuel Logic
- **⛽ Friendbot Integration**: Instant Testnet XLM requests via the official Stellar helper.
- **💸 Native Transfers**: Simple, direct XLM transfers to any valid G-Address.
- **🖥️ Responsive Dashboard**: A mobile-friendly, high-contrast developer interface.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Blockchain**: [Stellar SDK v13](https://github.com/stellar/js-stellar-sdk)
- **Smart Contracts**: Soroban (Rust 2021)
- **Wallet Kit**: [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)

---

## 📸 Screenshots

### 1. Multi-Wallet Connection
![Multi-Wallet Modal](screenshots/initial_state_1774011086614.png)

### 2. Global Fuel Ledger (Level 2 Gauge)
![Balance State](screenshots/connected_state_1774011095320.png)

### 3. Real-time Activity Feed
![Activity Feed](screenshots/final_transaction_state_1774011108913.png)

---

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/ayyush1326-afx/Stellar-gas-station.git
   npm install
   ```
2. **Setup Tools**: Ensure you have [Rust](https://rustup.rs/) and [Stellar CLI](https://developers.stellar.org/docs/smart-contracts/getting-started/setup) installed for contract deployment.
3. **Run Dev**: `npm run dev`
4. **Deploy Contract**: Use the [Contract Deployment Guide](./contract_deployment_guide.md) to push the Rust code to Testnet.

---

## ⚖️ License
Distributed under the MIT License.

## 👤 Author
**Ayush** - [@ayyush1326-afx](https://github.com/ayyush1326-afx)
