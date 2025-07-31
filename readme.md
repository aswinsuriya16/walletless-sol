🔐 Solana Wallet-less App
A secure, backend-focused Solana application enabling users to interact with the Solana blockchain without requiring browser wallets like Phantom or Backpack. The backend leverages Shamir's Secret Sharing to securely manage and reconstruct private keys, ensuring robust security and seamless user experience.
🚀 Features

🪪 User Authentication: Secure signup and signin with JWT-based authentication.
🔑 Server-Managed Solana Keypairs: Generate and store Solana keypairs on the server, eliminating the need for browser extensions.
🔐 Shamir's Secret Sharing: Split private keys into shares with a threshold for secure storage and reconstruction in MongoDB.
💸 Devnet SOL Airdrops: Request SOL airdrops directly from the Solana Devnet.
🔁 SOL Transfers: Transfer SOL to other addresses securely via server-side transactions.
⚡️ Wallet-less Experience: Interact with the Solana blockchain without Phantom or browser extensions.

📦 Tech Stack
Backend

Node.js + Express: Robust server framework for handling API requests.
TypeScript: Type-safe development for reliability and maintainability.
MongoDB + Mongoose: Database for storing user data and key shares.
@solana/web3.js: Solana blockchain interactions for keypair generation, airdrops, and transfers.
Shamir's Secret Sharing (sss): Securely splits and reconstructs private keys.
jsonwebtoken: Secure JWT-based authentication.
bcrypt: Password hashing for secure storage.
bs58: Base58 encoding for Solana keys.

Frontend

React: Dynamic, component-based UI.
TailwindCSS: Modern, utility-first styling for a responsive interface.

🔐 Security Highlights

Shamir's Secret Sharing: Private keys are split into three shares with a threshold of two, stored securely in MongoDB. Only two shares are needed to reconstruct the key during signin or transfers, enhancing security.
JWT Authentication: Protects routes like airdrop and transfer, ensuring only authenticated users can access sensitive operations.
Password Hashing: Uses bcrypt to securely hash passwords before storage.
Mongoose Validation: Ensures data integrity with strict schemas for users and key shares.
