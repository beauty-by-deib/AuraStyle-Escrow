#!/bin/bash

# AuraStyle Contract Deployment Script
# Usage: ./deploy.sh <YOUR_SECRET_KEY>

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Secret key required"
  echo ""
  echo "Usage: ./deploy.sh SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  echo ""
  echo "How to get your secret key:"
  echo "1. Visit: https://laboratory.stellar.org"
  echo "2. Create Account → Generate Keypair"
  echo "3. Fund account with test XLM (friendbot)"
  echo "4. Copy the Secret Key (starts with S...)"
  exit 1
fi

SECRET_KEY="$1"
WASM_PATH="contract/target/wasm32-unknown-unknown/release/aura_style.wasm"
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

echo "🚀 Deploying AuraStyle Contract to Stellar Testnet..."
echo ""

# Check if WASM exists
if [ ! -f "$WASM_PATH" ]; then
  echo "❌ WASM file not found at: $WASM_PATH"
  echo ""
  echo "Build the contract first:"
  echo "  cd contract"
  echo "  cargo build --target wasm32-unknown-unknown --release"
  exit 1
fi

echo "📦 WASM file: $WASM_PATH"
echo "🌐 Network: Stellar Testnet"
echo "📍 RPC: $RPC_URL"
echo ""

# Deploy contract
echo "⏳ Deploying contract (this may take 1-2 minutes)..."
echo ""

CONTRACT_ID=$(soroban contract deploy \
  --wasm "$WASM_PATH" \
  --source "$SECRET_KEY" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$NETWORK_PASSPHRASE" 2>&1 | tail -1)

if [ -z "$CONTRACT_ID" ] || [[ "$CONTRACT_ID" != C* ]]; then
  echo "❌ Deployment failed. Check your secret key and try again."
  echo "Last output: $CONTRACT_ID"
  exit 1
fi

echo "✅ Contract deployed successfully!"
echo ""
echo "📋 Contract ID: $CONTRACT_ID"
echo ""
echo "Next steps:"
echo "1. Update .env file:"
echo "   CONTRACT_ID=$CONTRACT_ID"
echo ""
echo "2. Test the contract:"
echo "   soroban contract invoke \\
     --id $CONTRACT_ID \\
     --source-account <YOUR_PUBLIC_KEY> \\
     --rpc-url $RPC_URL \\
     --network-passphrase \"$NETWORK_PASSPHRASE\" \\
     -- get_booking --customer <CUSTOMER_ADDRESS>"
echo ""
echo "3. View on Stellar Expert:"
echo "   https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
