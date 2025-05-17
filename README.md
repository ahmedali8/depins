# DePINs

DePINs.io is an autonomous yield infrastructure layer that transforms idle infrastructure—such as bandwidth, compute, or storage—into real income through intelligent protocol orchestration.

By combining DePIN networks, Liquid Staking protocols, and AI-powered yield optimization, DePINs.io abstracts away the complexity of staking and restaking while maximizing returns for enterprises and developers.

➡️ Pitch Deck: [Figma](https://www.figma.com/deck/Q7wCGoot1X0L7Bky6wWKXl/depins.io-pitchdeck?node-id=1-255&t=dO3x2IcdUAKil9wE-1)

## 📁 Project Structure

```
├── client/                # Frontend application
├── server/                # Backend application
└── programs/              # Solana program files
```

## 🛠️ Setup and Installation

### Prerequisites

- Node.js (Latest LTS version)
- PostgreSQL
- Redis
- Solana CLI tools

### Frontend Setup

```bash
cd client
npm install
# Create a .env file based on .env.example
npm run dev
```

### Backend Setup

```bash
cd server
npm install
# Set up your environment variables
npm run migrate
npm run start:dev
```

## 🐳 Docker Support

### Development

```bash
docker-compose -f docker-compose.yml up
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up
```

## 🔑 Environment Variables

### Frontend (.env)

```
VITE_API_URL=your_api_url
```

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

## 📚 API Documentation

Once the server is running, access the docs at:

- Swagger UI: `http://localhost:3000/api`

## 🔹 Value Proposition

**Turn Idle Infrastructure Into Real Income.**
DePINs.io scans, scores, and deploys unused digital infrastructure into high-yield DePIN and staking protocols—automatically.

**No Web3 Complexity. No Friction. Just ROI.**

## 💡 Problem

Institutions and users sit on mountains of underutilized digital infrastructure. But today’s staking landscape is fragmented and technically complex:

- **Too Many Protocols**: Complex lockups, inconsistent rewards, governance layers
- **Too Much Setup**: Manual connections, wallet integrations, protocol-specific GUIs
- **Too Little Return**: Most infra is disconnected from any form of daily earning

Billions of dollars worth of yield is left on the table.

## ✅ Solution: Automated DePINs Orchestration

DePINs.io provides a set-and-forget layer that handles:

1. **Scan** — Detect idle resources (GPU, bandwidth, storage, CPU)
2. **Score** — Rank yield potential with DUVI (DePIN Utility Value Index)
3. **Deploy** — Auto-route to best DePINs & Liquid Staking vaults
4. **Earn** — Mint stTokens and auto-compound rewards

It abstracts away:

- Wallets
- Protocol-specific rules
- Gas
- Manual claiming or restaking

## 🔧 Key Features

| Feature           | Description                                                                    |
| ----------------- | ------------------------------------------------------------------------------ |
| **AI Optimizer**  | Uses real-time data to dynamically route assets to the highest-yield protocols |
| **Meta-Vault**    | Smart vaults that mint receipt tokens (e.g., stGRASS, stRENDER)                |
| **Adapter Layer** | Plug-in modules for DePINs like Grass, Render, Marinade, Nosana                |
| **DUVI Scoring**  | Ranks resource utility using live protocol benchmarks                          |
| **Risk Controls** | Policy wallets, validator allowlists, failure fallback logic                   |
| **Non-Custodial** | Infra stays under user control—DePINs.io just optimizes yield                  |

## 🌐 Ecosystem Integrations

| Protocol     | Status         | Description                               |
| ------------ | -------------- | ----------------------------------------- |
| Grass        | ✅ Integrated  | Bandwidth sharing via browser extension   |
| Marinade     | ✅ Integrated  | SOL to mSOL staking vaults                |
| Render       | 🔄 In Progress | GPU rendering with real-time work         |
| Hivemapper   | 🔄 In Progress | Street-mapping via dashcam                |
| Nosana       | 🔄 In Progress | DePIN-based CI/CD job marketplace         |
| Picasso      | 🔄 Pilot       | Restaking protocol across Cosmos chains   |
| Jito Finance | 🔄 In Progress | MEV staking infrastructure                |
| IoTeX        | 🔄 In Progress | IoT-based proof-of-participation protocol |
| Helium       | 🔄 In Progress | Decentralized wireless network            |

## 🔄 Architecture Overview

1. **Local Scanner** → Detects idle infra (bandwidth, CPU, etc.)
2. **AI Optimizer** → Continuously reroutes assets to best options
3. **Adapter Layer** → Maps DePINs to unified deployment interface
4. **Meta-Vault** → Manages tokens and restaking logic
5. **Dashboard** → Real-time yield monitoring & config UI

## 💸 Business Model

| Revenue Stream           | Explanation                                                     |
| ------------------------ | --------------------------------------------------------------- |
| **Yield Cut**            | 2–5% fee on earned staking rewards                              |
| **SaaS Dashboard**       | Paid institutional dashboards for config, policy, and analytics |
| **ETF Management**       | Revenue from stBASKET vault: a curated DePIN asset index        |
| **Fully Automated Plan** | 33.33% of rewards for fully-managed infra monetization plan     |

## 🚀 Roadmap

| Quarter | Milestone                                                                |
| ------- | ------------------------------------------------------------------------ |
| Q2 2025 | Launch Meta-Vault + Grass + Optimizer                                    |
| Q3 2025 | Add Render, Nosana, and stBASKET token                                   |
| Q4 2025 | SDK for DePIN onboarding, EU compliance                                  |
| Q1 2026 | Cross-chain restaking + DAO tooling                                      |
| 2026+   | Become the default DePIN orchestration layer for all Web3 infra projects |

## 🔭 Vision

Every organization has untapped infrastructure potential.

DePINs.io activates it—securely, automatically, and non-custodially.

We believe in a future where:

- Every device can earn passively
- Every surplus resource is auto-tokenized
- Every company can stake infra like capital

All rights reserved © 2025
