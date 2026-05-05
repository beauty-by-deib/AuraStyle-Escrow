import { useState } from 'react';
import axios from 'axios';

export default function BookingForm({ walletAddress, kit, onRecommendation }) {
  const [image, setImage]     = useState(null);
  const [stylist, setStylist] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Get AI recommendation
      const base64 = await toBase64(image);
      const { data: rec } = await axios.post('/api/recommend', { image: base64 });
      onRecommendation(rec);

      // 2. Sign & submit booking transaction via wallet
      const { data: xdr } = await axios.post('/api/book', {
        customer: walletAddress,
        stylist,
        amount: rec.price,
      });
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
      });
      await axios.post('/api/submit', { xdr: signedTxXdr });
      alert('Booking confirmed! Funds locked in escrow.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload Photo
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
      </label>
      <label>
        Stylist Address
        <input value={stylist} onChange={e => setStylist(e.target.value)} placeholder="G…" required />
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Processing…' : 'Book & Lock Funds'}</button>
    </form>
  );
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
