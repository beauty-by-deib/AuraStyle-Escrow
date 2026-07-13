# AuraStyle Deployment Guide

## Quick Start

This guide covers deploying the AuraStyle Soroban smart contract to the Stellar testnet.

### Prerequisites

- Stellar testnet account with funded XLM
- `soroban-cli` installed: `cargo install soroban-cli`
- Rust 1.75-1.81 with `wasm32-unknown-unknown` target
- Node.js 18+ for frontend deployment

---

## Contract Deployment

### 1. Build the WASM Contract

```bash
cd contract
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

The compiled WASM will be at: `contract/target/wasm32-unknown-unknown/release/aura_style.wasm`

### 2. Deploy to Stellar Testnet

Set up your environment:

```bash
export SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
export NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
```

Deploy the contract:

```bash
soroban contract deploy \
  --wasm contract/target/wasm32-unknown-unknown/release/aura_style.wasm \
  --source-account <YOUR_PUBLIC_KEY> \
  --rpc-url $SOROBAN_RPC_URL \
  --network-passphrase "$NETWORK_PASSPHRASE"
```

**Output:** Save the returned contract ID (starts with `C...`)

### 3. Update `.env` with Contract ID

```bash
cp .env.example .env
# Edit .env and set:
# CONTRACT_ID=CXXXXXXX... (from deployment above)
```

---

## Frontend Deployment

### 1. Install Dependencies

```bash
cd frontend
npm ci
```

### 2. Build for Production

```bash
npm run build
```

Output will be in `frontend/dist/`

### 3. Deploy to Vercel/Netlify

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## CI/CD Pipeline

The repository includes GitHub Actions workflows:

- **`.github/workflows/contract.yml`** — Builds contract WASM, runs tests, checks formatting
- **`.github/workflows/frontend.yml`** — Installs deps, builds frontend, validates

Push to `main` or `develop` branches to trigger automation.

---

## Testing the Contract

### 1. Fund Your Testnet Account

Visit https://laboratory.stellar.org and fund your account with test XLM.

### 2. Call Contract Functions

Using `soroban-cli`:

```bash
# Get a booking
soroban contract invoke \
  --id $CONTRACT_ID \
  --source-account <YOUR_PUBLIC_KEY> \
  --rpc-url $SOROBAN_RPC_URL \
  --network-passphrase "$NETWORK_PASSPHRASE" \
  -- get_booking --customer <CUSTOMER_ADDRESS>
```

### 3. Test via Frontend

1. Run the frontend dev server: `npm run dev` in `frontend/`
2. Connect your Stellar wallet (Freighter, Albedo, etc.)
3. Submit a booking through the UI
4. Verify the transaction on https://stellar.expert (testnet)

---

## Contract Functions

### `book_style`
Lock USDC funds in escrow when a booking is created.

**Parameters:**
- `customer`: Address (signer)
- `stylist`: Address receiving the booking
- `token_addr`: USDC contract address (Testnet: CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA)
- `amount`: i128 (stroops, e.g., 150 USDC = 1_500_000_000 stroops)

### `complete_service`
Release funds to stylist after service confirmation.

**Parameters:**
- `customer`: Address (signer)

### `refund`
Return funds to customer if service is cancelled.

**Parameters:**
- `customer`: Address (signer)

### `get_booking`
Read booking details.

**Parameters:**
- `customer`: Address

---

## Troubleshooting

**"Contract not found"**
- Verify CONTRACT_ID in .env is correct
- Ensure the contract was deployed to the testnet you're targeting

**"Insufficient balance"**
- Fund your testnet account again at laboratory.stellar.org

**"Transaction failed"**
- Check stellar.expert for detailed error messages
- Verify all addresses are valid Stellar addresses (start with `G`)

---

## Next Steps

1. **Deploy the contract** to testnet using the steps above
2. **Test with frontend** using the booking UI
3. **Integrate a backend API** to handle XDR transaction building
4. **Set up payment** from bookings to developer/platform wallet
5. **Add dispute resolution** logic for service quality issues

---

## Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Testnet](https://stellar.org/developers/testnet/)
- [Stellar CLI](https://github.com/stellar/stellar-cli)
- [Freighter Wallet](https://www.freighter.app)
