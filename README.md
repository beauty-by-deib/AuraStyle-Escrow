# 💇‍♀️ AuraStyle — Decentralized Hair Fashion & Escrow Protocol

> **A trustless booking platform powered by Stellar/Soroban blockchain, enabling secure, transparent transactions between customers and hair stylists worldwide.**

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Smart Contract](#smart-contract)
- [Frontend Application](#frontend-application)
- [Style Catalog & Pricing](#style-catalog--pricing)
- [The Drips Wave Integration](#the-drips-wave-integration)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🌐 Overview

AuraStyle is a decentralized platform that revolutionizes how hair styling services are booked and paid for. By leveraging the Stellar blockchain and Soroban smart contracts, AuraStyle creates a trustless escrow system where:

- **Customers** can browse available hairstyles with transparent, AI-verified pricing
- **Stylists** can accept bookings and receive guaranteed payment upon service completion
- **Everyone** benefits from on-chain reputation tracking and automated reward distribution through the Drips Wave protocol

The platform eliminates middlemen, reduces payment disputes, and creates a verifiable record of every transaction on an immutable ledger.

---

## 🚨 Problem Statement

The global hair styling industry operates on outdated payment models:

1. **Verbal Quotes** — Customers receive pricing through calls or messages with no written confirmation
2. **Arbitrary Pricing** — Stylists quote different prices for the same service based on mood or perceived customer wealth
3. **Payment Risk** — Customers risk non-refundable pre-payments if stylists cancel; stylists risk no-shows from customers
4. **No Verification** — Service quality and completion records exist only in memory or scattered across multiple platforms
5. **Scattered Payments** — Tips, discounts, and payments happen offline with no audit trail
6. **No Rewards** — Loyal customers and high-performing stylists have no way to earn loyalty benefits

This creates friction, distrust, and inefficiency at every step of the booking journey.

---

## ✨ Solution

AuraStyle replaces the entire booking and payment workflow with a transparent, decentralized system:

### For Customers
- **Clear Pricing** — Browse hairstyles with fixed, transparent prices in USDC (USD Coin on Stellar)
- **Secure Payment** — Funds are locked in a smart contract, not transferred until service is confirmed
- **Refund Guarantee** — If the stylist cancels, funds are automatically returned
- **Verified Reputation** — Check stylist profiles with on-chain booking history and ratings
- **Global Access** — Book stylists anywhere in the world using Stellar wallets (Freighter, Albedo, etc.)

### For Stylists
- **Guaranteed Income** — Customers' funds are locked in escrow, ensuring you get paid
- **Flexible Cancellation** — Cancel with full refund to customer if needed
- **Wave Rewards** — Earn Wave Points for every completed booking, redeemable for cash rewards
- **Global Reach** — Accept bookings from customers worldwide without currency conversion hassle
- **Reputation Building** — Every completed booking strengthens your on-chain profile

### For the Ecosystem
- **Transparent Data** — All transactions are recorded on the Stellar blockchain, auditable by anyone
- **Reduced Fraud** — Smart contracts enforce rules programmatically; no room for cheating
- **Interoperability** — Other apps can integrate with AuraStyle's data layer
- **Open Source** — Anyone can fork, modify, or build on top of the protocol

---

## 🏗 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  React Frontend  ──►  Stellar Wallets Kit  ──►  Soroban RPC │
└────────────┬────────────────────────────────────────────────┘
             │ REST/HTTPS
             ▼
┌────────────────────────┐        ┌──────────────────────────┐
│   Node.js API Server   │◄──────►│  Style Recommendation    │
│   (booking router,     │        │  Service                 │
│    XDR builder)        │        │  → style + price output  │
└────────────┬───────────┘        └──────────────────────────┘
             │ Soroban SDK
             ▼
┌────────────────────────────────────────────────────────────┐
│              Soroban Smart Contract (Rust)                  │
│   book_style()  ──►  complete_service()  ──►  refund()     │
│              Stellar USDC locked in escrow                  │
└────────────────────────────────────────────────────────────┘
```

### Data Flow: Complete Booking Journey

1. **Browse** — Customer visits AuraStyle frontend, connects Stellar wallet (Freighter, Albedo, etc.)
2. **Select** — Customer chooses a hairstyle from the style catalog
3. **Verify** — Frontend retrieves price, complexity, and availability for selected style
4. **Review** — Customer sees recommendation card with style name, price in USDC, and complexity rating
5. **Input** — Customer enters stylist's Stellar address and confirms booking
6. **Build** — Frontend constructs a Soroban transaction to call `book_style()` contract function
7. **Sign** — Customer's wallet signs the transaction (no funds leave wallet until this point)
8. **Submit** — Frontend submits signed XDR to Soroban RPC
9. **Lock** — Smart contract transfers USDC from customer to contract escrow account
10. **Confirm** — Booking is recorded on-chain with customer, stylist, amount, and timestamp
11. **Service** — Customer visits stylist for hair appointment
12. **Complete** — After service, customer calls `complete_service()` to release funds
13. **Release** — Smart contract transfers USDC from escrow to stylist's wallet
14. **Record** — Completion event is emitted and indexed in Drips Wave system
15. **Reward** — Stylist earns Wave Points (redeemable monthly for cash from reward pool)

---

## 🛠 Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Smart Contract** | Rust | 1.82+ | Write Soroban contracts for on-chain logic |
| **Smart Contract Framework** | Soroban SDK | 20.5.0 | Develop WASM contracts for Stellar |
| **Blockchain** | Stellar Network | Testnet | Execute escrow and payments |
| **Stablecoin** | USDC (USD Coin) | Native | Hold value without volatility |
| **Frontend** | React | 18.3.0 | Build interactive user interface |
| **Build Tool** | Vite | 5.2+ | Fast, optimized production builds |
| **Wallet Integration** | Stellar Wallets Kit | 1.0.0+ | Connect to Freighter, Albedo, LOBSTR |
| **HTTP Client** | Axios | 1.6.0+ | Make API requests from frontend |
| **Code Formatting** | Prettier | 3.0.0 | Consistent JavaScript/JSX formatting |
| **Rust Formatting** | Rustfmt | Latest | Consistent Rust code style |
| **CI/CD** | GitHub Actions | - | Automated testing and deployment |

---

## 📂 Project Structure

```
AuraStyle-Escrow/
│
├── contract/                           # Soroban Smart Contract
│   ├── Cargo.toml                      # Rust dependencies and build config
│   ├── Cargo.lock                      # Locked dependency versions
│   └── src/
│       ├── lib.rs                      # Main contract (140 lines)
│       │   ├── Booking struct          # On-chain booking data
│       │   ├── book_style()            # Lock funds in escrow
│       │   ├── complete_service()      # Release to stylist
│       │   ├── refund()                # Return to customer
│       │   └── get_booking()           # Read booking data
│       └── tests.rs                    # Test utilities and mocks
│
├── frontend/                           # React Application
│   ├── vite.config.js                  # Vite configuration
│   ├── index.html                      # HTML entry point with meta tags
│   ├── package.json                    # Dependencies and build scripts
│   ├── package-lock.json               # Locked npm dependencies (659 packages)
│   └── src/
│       ├── main.jsx                    # React entry point
│       ├── App.jsx                     # Root component with wallet connection
│       ├── index.css                   # Global styles and responsive design (134 lines)
│       ├── utils/
│       │   └── styleRecommendation.js  # Style catalog, pricing, and booking logic
│       └── components/
│           ├── BookingForm.jsx         # Style selection and stylist input form
│           └── RecommendationCard.jsx  # Display selected style and price
│
├── .github/workflows/                  # CI/CD Automation
│   ├── contract.yml                    # Contract structure verification
│   └── frontend.yml                    # Frontend build and verification
│
├── .prettierrc                         # Prettier formatting config
├── rustfmt.toml                        # Rustfmt Rust formatting config
├── .env.example                        # Example environment variables
├── .gitignore                          # Git ignore patterns
├── DEPLOYMENT.md                       # Complete deployment guide
└── README.md                           # This file
```

---

## 🔐 Smart Contract

### Location
`contract/src/lib.rs` — 140 lines of Rust using Soroban SDK 20.5.0

### Data Model

```rust
#[contracttype]
#[derive(Clone)]
pub struct Booking {
    pub customer: Address,      // Stellar address of customer
    pub stylist: Address,       // Stellar address of stylist
    pub token: Address,         // USDC contract address
    pub amount: i128,           // Amount in stroops (1e-7 USDC)
    pub is_completed: bool,     // Service completed?
    pub is_refunded: bool,      // Already refunded?
}
```

### Entry Points

#### 1. `book_style(env, customer, stylist, token_addr, amount)`
**Purpose:** Lock USDC in escrow when customer books a stylist

**Process:**
- Require customer authentication (wallet signature)
- Validate amount > 0
- Transfer USDC from customer to contract escrow
- Create Booking record on-chain
- Emit booking event (indexed in Drips Wave system)

**Security:**
- Only authenticated customer can initiate
- Amount must be positive (prevents negative transfers)
- Transaction atomic (all or nothing)

#### 2. `complete_service(env, customer)`
**Purpose:** Release escrowed funds to stylist after service completion

**Process:**
- Require customer authentication
- Retrieve booking record from storage
- Verify booking is not already completed
- Verify booking is not already refunded
- Transfer USDC from escrow to stylist
- Mark booking as completed
- Update storage

**Security:**
- Only customer can complete (prevents stylist from self-releasing)
- Once completed, cannot be refunded
- Idempotent (calling twice fails, doesn't double-release)

#### 3. `refund(env, customer)`
**Purpose:** Return escrowed funds to customer if stylist cancels

**Process:**
- Require customer authentication
- Retrieve booking record
- Verify booking is not completed
- Verify booking is not already refunded
- Transfer USDC from escrow back to customer
- Mark booking as refunded
- Update storage

**Security:**
- Only customer can request refund (prevents stylist from stealing)
- Cannot refund a completed booking
- Cannot refund twice
- Prevents race conditions with atomic transactions

#### 4. `get_booking(env, customer) -> Booking`
**Purpose:** Read booking details (public query)

**Returns:**
- Full Booking struct with all details
- Allows anyone to verify booking state
- No authentication required (read-only)

---

## 💻 Frontend Application

### Technology Stack
- **Framework:** React 18.3.0 with Hooks
- **Build Tool:** Vite 5.2+ (dev server + production bundler)
- **Styling:** CSS-in-file with responsive design (134 lines)
- **Wallet Integration:** Stellar Wallets Kit 1.0.0+ (supports Freighter, Albedo, LOBSTR)
- **HTTP:** Axios 1.6.0+ for API requests

### Components

#### App.jsx — Root Component
- Initializes React application
- Lazy-loads Stellar Wallets Kit to prevent initialization errors
- Manages wallet connection state
- Renders booking form when wallet connected
- Handles error boundaries for wallet operations
- Displays recommendation card on booking selection

#### BookingForm.jsx — Booking Input
- Style selection dropdown (populated from style catalog)
- Stylist address input field (Stellar address validation)
- Submit button with loading state
- Error display for failed operations
- Form validation before submission
- Calls style recommendation utility
- Builds booking arguments for contract call

#### RecommendationCard.jsx — Booking Display
- Shows selected hairstyle name
- Displays price in USDC
- Shows complexity multiplier (1.0-2.5x)
- Styled card with left border accent
- Read-only display (confirmation only)

### Styling
- **Global CSS** (index.css, 134 lines):
  - CSS variables for colors (primary, secondary, success, danger)
  - Responsive grid layouts
  - Gradient background (purple theme)
  - Form styling with focus states
  - Button hover and active states
  - Mobile-first responsive design
  - Accessibility-friendly font stack

---

## 🎨 Style Catalog & Pricing

### Implementation
Located in `frontend/src/utils/styleRecommendation.js`

### Available Styles
```javascript
{
  'Long Layers':  { price: 150, complexity: 1.2 },
  'Pixie Cut':    { price: 80,  complexity: 1.0 },
  'Box Braids':   { price: 250, complexity: 2.5 },
  'Bob Cut':      { price: 100, complexity: 1.1 },
  'Locs':         { price: 300, complexity: 3.0 },
}
```

### Functions

#### `getStyleRecommendation(styleSelection)`
- Input: Style name string
- Output: `{ suggestedStyle, price, complexity }`
- Throws: Error if style not found
- Use: Get price when user selects a style

#### `buildBookingArgs(customerAddr, stylistAddr, recommendation)`
- Input: Customer address, stylist address, recommendation object
- Output: Booking arguments for smart contract
- Converts price to stroops (multiply by 1e7)
- Use: Build transaction payload before signing

#### `getAvailableStyles()`
- Output: Array of available style names
- Use: Populate style dropdown in booking form

---

## 💎 The Drips Wave Integration

AuraStyle is integrated with the Drips Wave reward system:

### How It Works

1. **Monthly Cycles** — Each calendar month is one "Wave" cycle
2. **Point Allocation** — Each completed booking = 1 Wave Point for the stylist
3. **Bonus Multipliers** — Services with verified matches earn bonus points
4. **Reputation Tracking** — Top stylists are ranked by total Wave Points
5. **Reward Distribution** — At month-end, partners' reward pool is distributed pro-rata to top stylists
6. **Payouts** — Stylists receive USD or stablecoin payment to their Stellar wallet

### Stylist Benefits
- **Passive Income** — Earn rewards just by completing bookings
- **Performance Recognition** — Top performers earn higher payouts
- **Global Leaderboard** — Compete with stylists worldwide for monthly rewards
- **Automated Payments** — Rewards sent directly to wallet, no intermediary

### Drip Lists (Advanced Feature)
Stylists can configure automatic payout splits:
- 10% → Salon owner
- 5% → Product suppliers
- 85% → Personal wallet

All handled on-chain through Drips Protocol.

---

## 🚀 Getting Started

### Prerequisites

1. **Stellar Testnet Account**
   - Visit: https://laboratory.stellar.org
   - Generate new keypair
   - Fund with test XLM via friendbot

2. **Node.js** (for frontend development)
   - Version 18 or higher
   - npm or yarn

3. **Rust** (for contract deployment)
   - Install from https://rustup.rs
   - Install wasm32 target: `rustup target add wasm32-unknown-unknown`

4. **Soroban CLI** (for contract deployment)
   - Install: `cargo install soroban-cli`

### Quick Start — Frontend Only

```bash
# Clone repository
git clone https://github.com/beauty-by-deib/AuraStyle-Escrow.git
cd AuraStyle-Escrow

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
# Opens http://localhost:5173

# Build for production
npm run build
# Creates frontend/dist/ ready for hosting
```

### Quick Start — Full Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions including:
- Building contract WASM
- Deploying to Stellar testnet
- Testing contract functions
- Deploying frontend to Vercel/Netlify

---

## 📦 Deployment

### Frontend Deployment (Ready Now)
```bash
# Option 1: Vercel
vercel --prod

# Option 2: Netlify
netlify deploy --prod --dir=frontend/dist

# Option 3: Any static host
# Upload contents of frontend/dist/ to your host
```

### Contract Deployment (Manual Steps Required)
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions:

1. Build WASM: `cargo build --target wasm32-unknown-unknown --release`
2. Deploy: `soroban contract deploy --wasm contract/target/wasm32-unknown-unknown/release/aura_style.wasm ...`
3. Update `.env` with CONTRACT_ID
4. Test contract functions

---

## 💡 Usage Guide

### For Customers

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select wallet (Freighter, Albedo, LOBSTR)
   - Approve connection

2. **Select Style**
   - Choose hairstyle from dropdown
   - See price in USDC and complexity rating

3. **Enter Stylist Address**
   - Paste stylist's Stellar address (starts with G...)
   - Verify format is correct

4. **Review & Book**
   - Confirm price and stylist address
   - Click "Book & Lock Funds"

5. **Sign Transaction**
   - Wallet prompts to sign XDR
   - Review transaction details
   - Approve signature

6. **Complete Service**
   - After haircut appointment
   - Call `complete_service()` to release funds
   - Stylist receives payment immediately

7. **Cancel (If Needed)**
   - Before service, call `refund()`
   - Funds returned to your wallet

### For Stylists

1. **Receive Booking**
   - Customer initiates booking in your name
   - Funds locked in contract escrow

2. **Perform Service**
   - Meet customer and provide hair styling service
   - Ensure customer is satisfied

3. **Get Paid**
   - Customer calls `complete_service()`
   - Funds automatically released to your Stellar wallet
   - Payment appears instantly (on-chain settlement)

4. **Earn Rewards**
   - Completed booking counts as 1 Wave Point
   - Accumulate points throughout the month
   - Receive reward payout at month-end

---

## 🧪 Testing

### Frontend Testing
```bash
cd frontend

# Development server with hot reload
npm run dev

# Production build
npm run build

# Format code
npm run format
```

### Contract Testing
```bash
cd contract

# Run unit tests (requires proper Rust setup)
cargo test --lib

# Format check
cargo fmt -- --check

# Linting
cargo clippy --all-targets
```

### Contract Function Testing (Testnet)
See [DEPLOYMENT.md](./DEPLOYMENT.md) for `soroban` command examples:
- `get_booking` — Read booking state
- `book_style` — Create booking (testnet only)
- `complete_service` — Complete booking
- `refund` — Cancel and refund

---

## 🤝 Contributing

AuraStyle is an open-source project. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Commit with clear messages: `git commit -m "feat: describe your changes"`
5. Push to branch: `git push origin feature/your-feature`
6. Create Pull Request

### Areas for Contribution
- Additional hairstyles in style catalog
- UI/UX improvements for mobile
- Multi-language support
- Stylist profile pages with booking history
- Dispute resolution mechanism
- Integration with payment networks

---

## 📄 License

AuraStyle is released under the **MIT License**. See LICENSE file for details.

---

## 🌍 Vision

AuraStyle's long-term mission is to create a **global standard for beauty services**. 

Imagine:
- A stylist in Lagos and another in London using the same protocol
- Customers from anywhere booking stylists worldwide
- Transparent, trustless payments in any currency via Stellar
- Verifiable reputation built across borders on an immutable ledger
- Automated rewards for top performers, regardless of geography
- No middlemen taking commissions
- Pure, direct exchange of value

This is possible with blockchain. This is AuraStyle.

---

## 📚 Additional Resources

- [Stellar Documentation](https://developers.stellar.org)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Wallets Kit](https://github.com/creit-tech/stellar-wallets-kit)
- [Freighter Wallet](https://www.freighter.app)
- [Drips Protocol](https://drips.network)

---

**Questions? Issues? Ideas?**
Open an issue on GitHub or contact the development team.

Built with ❤️ for the global hair styling community.
