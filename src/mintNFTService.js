import React, { useState } from 'react';
import { mintNFTOnChain } from './contract';

function MintNFT({ walletAddress }) {
  const [artName, setArtName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!walletAddress) {
      setStatus('⚠️ Please connect your wallet first!');
      return;
    }

    if (!artName || !description) {
      setStatus('⚠️ Please fill in all fields!');
      return;
    }

    try {
      setLoading(true);
      setStatus('🔄 Preparing transaction...');

      // For now using a placeholder image URI - real IPFS upload comes next
      const imageUri = image
        ? `ipfs://placeholder-${Date.now()}`
        : 'ipfs://no-image';

      setStatus('🔄 Please confirm in Freighter wallet...');

      const result = await mintNFTOnChain(
        walletAddress,
        artName,
        description,
        imageUri
      );

      setStatus(
        `✅ NFT Minted On-Chain!\nToken ID: ${result.tokenId}\nTx: ${result.hash.slice(0, 10)}...`
      );

    } catch (error) {
      setStatus('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎨 Mint Your NFT</h2>

      <div style={styles.field}>
        <label style={styles.label}>Art Name</label>
        <input
          style={styles.input}
          placeholder="e.g. Sunset in Lagos"
          value={artName}
          onChange={(e) => setArtName(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          placeholder="Describe your artwork..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Upload Artwork</label>
        <input
          type="file"
          accept="image/*"
          style={styles.fileInput}
          onChange={(e) => setImage(e.target.files[0])}
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            style={styles.preview}
          />
        )}
      </div>

      <button
        onClick={handleMint}
        style={loading ? styles.buttonDisabled : styles.button}
        disabled={loading}
      >
        {loading ? '⏳ Minting...' : '🚀 Mint NFT On-Chain'}
      </button>

      {status && <p style={styles.status}>{status}</p>}
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
  title: { color: '#7c3aed', textAlign: 'center', marginBottom: '24px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', color: '#888888', fontSize: '14px', marginBottom: '6px' },
  input: {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #333333', backgroundColor: '#0a0a0a',
    color: '#ffffff', fontSize: '14px', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #333333', backgroundColor: '#0a0a0a',
    color: '#ffffff', fontSize: '14px', height: '80px', boxSizing: 'border-box',
  },
  fileInput: { color: '#ffffff', fontSize: '14px' },
  preview: { width: '100%', borderRadius: '8px', marginTop: '10px', maxHeight: '200px', objectFit: 'cover' },
  button: {
    backgroundColor: '#7c3aed', color: '#ffffff', border: 'none',
    borderRadius: '8px', padding: '14px', fontSize: '16px',
    cursor: 'pointer', width: '100%', marginTop: '8px',
  },
  buttonDisabled: {
    backgroundColor: '#444444', color: '#888888', border: 'none',
    borderRadius: '8px', padding: '14px', fontSize: '16px',
    width: '100%', marginTop: '8px',
  },
  status: {
    marginTop: '16px', color: '#f59e0b', fontSize: '13px',
    textAlign: 'center', whiteSpace: 'pre-line',
  },
};

export default MintNFT;
