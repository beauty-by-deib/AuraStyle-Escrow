import { useState } from 'react';
import { StellarWalletsKit, WalletNetwork } from '@creit.tech/stellar-wallets-kit';
import BookingForm from './components/BookingForm';
import RecommendationCard from './components/RecommendationCard';

const kit = new StellarWalletsKit({ network: WalletNetwork.TESTNET });

export default function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  async function connectWallet() {
    await kit.openModal({ onWalletSelected: async (option) => {
      kit.setWallet(option.id);
      const { address } = await kit.getAddress();
      setWalletAddress(address);
    }});
  }

  return (
    <main className="app">
      <h1>💇‍♀️ AuraStyle</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p className="address">{walletAddress.slice(0, 8)}…</p>
          <BookingForm
            walletAddress={walletAddress}
            kit={kit}
            onRecommendation={setRecommendation}
          />
          {recommendation && <RecommendationCard data={recommendation} />}
        </>
      )}
    </main>
  );
}
