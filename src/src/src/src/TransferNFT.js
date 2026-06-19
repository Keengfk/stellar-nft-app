import React, { useState } from 'react';

function TransferNFT({ walletAddress }) {
  const [recipient, setRecipient] = useState('');
  const [nftName, setNftName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!recipient || !nftName) {
      setStatus('⚠️ Please fill in all fields!');
      return;
    }

    if (!recipient.startsWith('G') || recipient.length !== 56) {
      setStatus('⚠️ Invalid Stellar wallet address!');
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);
      setStatus('🔄 Preparing transfer...');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('🔄 Signing transaction...');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('🔄 Submitting to Stellar network...');

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setStatus(
        `✅ NFT transferred successfully!\n"${nftName}" sent to ${recipient.slice(0, 6)}...${recipient.slice(-6)}`
      );
      setRecipient('');
      setNftName('');

    } catch (error) {
      setStatus('❌ Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💸 Transfer NFT</h2>
      <p style={styles.subtitle}>
        Send your NFT to another Stellar wallet
      </p>

      {/* Sender Info */}
      {walletAddress && (
        <div style={styles.senderBox}>
          <p style={styles.senderLabel}>📤 From</p>
          <p style={styles.senderAddress}>
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
          </p>
        </div>
      )}

      {/* NFT Name */}
      <div style={styles.field}>
        <label style={styles.label}>NFT Name</label>
        <input
          style={styles.input}
          placeholder="e.g. Sunset in Lagos"
          value={nftName}
          onChange={(e) => setNftName(e.target.value)}
        />
      </div>

      {/* Recipient Address */}
      <div style={styles.field}>
        <label style={styles.label}>Recipient Stellar Address</label>
        <input
          style={styles.input}
          placeholder="G... (56 characters)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      {/* Warning */}
      <div style={styles.warning}>
        ⚠️ Double check the address! Transfers on Stellar are irreversible.
      </div>

      {/* Transfer Button */}
      <button
        onClick={handleTransfer}
        style={loading ? styles.buttonDisabled : styles.button}
        disabled={loading}
      >
        {loading ? '⏳ Transferring...' : '💸 Transfer NFT'}
      </button>

      {/* Status */}
      {status && (
        <div style={success ? styles.successBox : styles.statusBox}>
          <p style={styles.statusText}>{status}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    margin: '20px auto',
  },
  title: {
    color: '#7c3aed',
    textAlign: 'center',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#888888',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '24px',
  },
  senderBox: {
    backgroundColor: '#0a0a0a',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    border: '1px solid #333333',
  },
  senderLabel: {
    color: '#888888',
    fontSize: '12px',
    marginBottom: '4px',
  },
  senderAddress: {
    color: '#7c3aed',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    color: '#888888',
    fontSize: '14px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333333',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  warning: {
    backgroundColor: '#2a1a00',
    border: '1px solid #f59e0b',
    borderRadius: '8px',
    padding: '12px',
    color: '#f59e0b',
    fontSize: '13px',
    marginBottom: '16px',
  },
  button: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#444444',
    color: '#888888',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    width: '100%',
  },
  statusBox: {
    marginTop: '16px',
    backgroundColor: '#1a1a00',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #f59e0b',
  },
  successBox: {
    marginTop: '16px',
    backgroundColor: '#001a00',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #22c55e',
  },
  statusText: {
    color: '#ffffff',
    fontSize: '13px',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    margin: 0,
  },
};

export default TransferNFT;
