import React, { useState } from 'react';
import { isConnected, getPublicKey, setAllowed } from '@stellar/freighter-api';
import MintNFT from './MintNFT';
import Gallery from './Gallery';
import TransferNFT from './TransferNFT';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');

  const connectWallet = async () => {
    try {
      setStatus('Connecting...');
      if (await isConnected()) {
        await setAllowed();
        const publicKey = await getPublicKey();
        setWalletAddress(publicKey);
        setStatus('');
      } else {
        setStatus('Please install Freighter wallet!');
      }
    } catch (error) {
      setStatus('Connection failed. Try again.');
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>🪐 OrbitNFT</h1>
        <p style={styles.subtitle}>
          Mint and collect Digital Art NFTs on Stellar
        </p>

        {walletAddress ? (
          <div style={styles.walletConnected}>
            ✅ {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
          </div>
        ) : (
          <button onClick={connectWallet} style={styles.walletButton}>
            🔌 Connect Wallet
          </button>
        )}
        {status && <p style={styles.status}>{status}</p>}
      </div>

      <div style={styles.tabs}>
        <button
          style={activeTab === 'gallery' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('gallery')}
        >
          🏛️ Gallery
        </button>
        <button
          style={activeTab === 'mint' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('mint')}
        >
          🎨 Mint
        </button>
        <button
          style={activeTab === 'transfer' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('transfer')}
        >
          💸 Transfer
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'gallery' && <Gallery walletAddress={walletAddress} />}
        {activeTab === 'mint' && <MintNFT walletAddress={walletAddress} />}
        {activeTab === 'transfer' && <TransferNFT walletAddress={walletAddress} />}
      </div>

    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', padding: '30px 20px 20px', borderBottom: '1px solid #1a1a1a' },
  title: { fontSize: '28px', color: '#7c3aed', marginBottom: '6px' },
  subtitle: { color: '#888888', fontSize: '14px', marginBottom: '16px' },
  walletButton: { backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer' },
  walletConnected: { backgroundColor: '#001a00', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px 24px', color: '#22c55e', fontSize: '14px', display: 'inline-block' },
  status: { color: '#f59e0b', fontSize: '13px', marginTop: '8px' },
  tabs: { display: 'flex', borderBottom: '1px solid #1a1a1a', backgroundColor: '#0a0a0a', position: 'sticky', top: 0, zIndex: 100 },
  tab: { flex: 1, padding: '14px', backgroundColor: 'transparent', border: 'none', color: '#888888', fontSize: '14px', cursor: 'pointer', borderBottom: '2px solid transparent' },
  tabActive: { flex: 1, padding: '14px', backgroundColor: 'transparent', border: 'none', color: '#7c3aed', fontSize: '14px', cursor: 'pointer', borderBottom: '2px solid #7c3aed' },
  content: { padding: '20px' },
};

export default App;
