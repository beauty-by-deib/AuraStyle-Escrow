# 💇‍♀️ AuraStyle — AI-Powered Hair Fashion & Escrow Protocol

AuraStyle is a decentralized booking and fashion-consultation platform built on the **Stellar / Soroban** network. It uses computer-vision AI to recommend hairstyles based on face shape, then secures payments in a trustless Soroban escrow contract that only releases funds when the service is confirmed.

---

## 🌐 Why AuraStyle?

The beauty industry runs on verbal quotes and cash handshakes. AuraStyle replaces that with:

- **AI-verified pricing** — the price is derived from style complexity, not a stylist's mood.
- **Trustless escrow** — customer funds are locked on-chain and only released on confirmation.
- **On-chain reputation** — every completed booking mints a verifiable record, feeding the Drips Wave reward system.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  React Frontend  ──►  Stellar Wallets Kit  ──►  Soroban RPC │
└────────────┬────────────────────────────────────────────────┘
             │ REST
             ▼
┌────────────────────────┐        ┌──────────────────────────┐
│   Node.js API Server   │◄──────►│  Python AI Microservice  │
│   (booking router,     │        │  TensorFlow Face-Mesh    │
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

**Data flow:**
1. User uploads photo → AI microservice returns `{ faceShape, suggestedStyle, price }`.
2. Frontend builds a Soroban transaction, user signs with their Stellar wallet.
3. `book_style` transfers USDC from customer to the contract address.
4. After the appointment, customer calls `complete_service` → funds released to stylist.
5. Completion event increments the stylist's Wave Points on the Drips Network.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Rust · Soroban SDK 20 |
| Blockchain | Stellar Network (USDC) |
| AI Model | Python · TensorFlow · MediaPipe Face Mesh |
| Backend API | Node.js · Express |
| Frontend | React 18 · Vite · Stellar Wallets Kit |

---

## 📂 Project Structure

```
AuraStyle-Escrow/
├── contract/
│   ├── Cargo.toml
│   └── src/lib.rs          # Soroban escrow contract
├── ai/
│   ├── ai_logic.js         # Recommendation + booking-arg builder
│   └── package.json
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── BookingForm.jsx
│           └── RecommendationCard.jsx
├── .env.example
└── .gitignore
```

---

## 🔐 Soroban Escrow Contract

The contract lives in `contract/src/lib.rs`. Three entry points:

```rust
// Lock funds when a booking is created
pub fn book_style(
    env: Env,
    customer: Address,
    stylist: Address,
    token_addr: Address,
    amount: i128,
)

// Release funds to stylist after service is confirmed
pub fn complete_service(env: Env, customer: Address)

// Refund customer if stylist cancels
pub fn refund(env: Env, customer: Address)
```

The `Booking` struct stored on-chain:

```rust
#[contracttype]
#[derive(Clone)]
pub struct Booking {
    pub customer:     Address,
    pub stylist:      Address,
    pub token:        Address,
    pub amount:       i128,
    pub is_completed: bool,
    pub is_refunded:  bool,
}
```

---

## 🤖 AI Recommendation Layer

`ai/ai_logic.js` calls the Python face-mesh microservice and maps the result to a price:

```js
const STYLE_CATALOG = {
  'Long Layers': { price: 150, complexity: 1.2 },
  'Pixie Cut':   { price: 80,  complexity: 1.0 },
  'Box Braids':  { price: 250, complexity: 2.5 },
};

async function getHairRecommendation(imageBase64) {
  const { data } = await axios.post(process.env.AI_API_URL + '/analyze', {
    image: imageBase64,
  });
  const rec = STYLE_CATALOG[data.suggestedStyle];
  return { suggestedStyle: data.suggestedStyle, ...rec };
}
```

---

## 💎 The Drips Wave Integration

Stylists join a monthly **Wave** cycle:

- Each `complete_service` call emits an on-chain event counted as a **Wave Point**.
- AI-verified style matches earn **Bonus Points** (the AI confirmed the style matched the face shape).
- At month-end, a reward pool (funded by hair-care brand partners) is distributed pro-rata to top-ranked stylists.
- A salon owner can configure a **Drip List** so that 10% of every payout automatically streams to suppliers or rent.

---

## 📦 Setup & Deployment

### Prerequisites
- [Rust + `wasm32-unknown-unknown` target](https://www.rust-lang.org/tools/install)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- Node.js ≥ 18

### 1. Clone & configure

```bash
git clone https://github.com/your-org/AuraStyle-Escrow.git
cd AuraStyle-Escrow
cp .env.example .env   # fill in your contract IDs and RPC URL
```

### 2. Build & deploy the contract

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/aura_style.wasm \
  --source <YOUR_SECRET_KEY> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

Copy the returned contract ID into your `.env` as `CONTRACT_ID`.

### 3. Run the AI service

```bash
cd ai
pip install tensorflow mediapipe flask
python app.py   # listens on :8000
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

---

## 🌍 Global Vision

A stylist in Lagos and a stylist in London use the same AI-matching and payment protocol — one global standard for beauty services, powered by Stellar USDC.
