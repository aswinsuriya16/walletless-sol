# 🔐 Solana Wallet-less App

A full-stack Solana-based application that allows users to interact with the blockchain **without a browser wallet like Phantom or Backpack**.

Users can:
- 🔑 Sign up and get a Solana keypair
- 🔐 Log in securely using JWT
- 💸 Request SOL airdrops from Devnet
- 🔁 Transfer SOL to others
- ⚡️ Use the app without Phantom or browser extensions

---

## 🚀 Features

- 🪪 User authentication (signup/signin)
- 🔑 Solana keypair generated and managed by server
- 💸 Airdrop request functionality
- 🔁 Transfer SOL to other addresses
- 🌐 Built with **TypeScript**, **Express**, **React**, and **MongoDB**

---

## 📦 Tech Stack

### Backend:
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- @solana/web3.js
- jsonwebtoken

### Frontend:
- React
- TailwindCSS 

---

## ⚙️ Setup Instructions

### 🔧 Backend

```bash
cd backend
npm install
npx tsc -b
node dist/server.js

### Frontend

```bash
cd frontend
npm install
npm run dev
