import React, { useState } from 'react';
import { isConnected, getPublicKey, setAllowed } from '@stellar/freighter-api';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    try {
      setStatus('Connecting...');
      
      if (await isConnected()) {
        await setAllowed();
        const publicKey = await getPublicKey();
        setWalletAddress(publicKey);
        setStatus('Wallet connected!');
      } else {
        setStatus('Please install Freighter wallet!');
      }
    } catch (error) {
      setStatus('Connection failed. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎨 Stellar NFT App</h1>
        <p style={styles.subtitle}>
          Mint and collect Digital Art NFTs on Stellar
        </p>
      </div>

      {/* Wallet Section */}
      <div style={styles.card}>
        {walletAddress ? (
          <div>
            <p style={styles.connected}>✅ Wallet Connected!</p>
            <p style={styles.address}>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
            </p>
          </div>
        ) : (
          <button onClick={connectWallet} style={styles.button}>
            🔌 Connect Freighter Wallet
          </button>
        )}
        {status && <p style={styles.status}>{status}</p>}
      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingTop: '40px',
  },
  title: {
    fontSize: '32px',
    color: '#7c3aed',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#888888',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
  },
  button: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 28px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  },
  connected: {
    color: '#22c55e',
    fontSize: '18px',
    marginBottom: '10px',
  },
  address: {
    color: '#888888',
    fontSize: '14px',
  },
  status: {
    marginTop: '16px',
    color: '#f59e0b',
    fontSize: '14px',
  },
};

export default App;
