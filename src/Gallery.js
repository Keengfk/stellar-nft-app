import React, { useState, useEffect } from 'react';

// Sample NFT data (will be replaced with real Stellar data later)
const sampleNFTs = [
  {
    id: 1,
    name: 'Sunset in Lagos',
    description: 'A beautiful sunset over Lagos city',
    image: 'https://picsum.photos/300/300?random=1',
    owner: 'GBXY...3456',
    minted: 'Jun 19, 2026',
  },
  {
    id: 2,
    name: 'African Patterns',
    description: 'Traditional African art patterns',
    image: 'https://picsum.photos/300/300?random=2',
    owner: 'GBXY...3456',
    minted: 'Jun 19, 2026',
  },
  {
    id: 3,
    name: 'Stellar Universe',
    description: 'The beauty of the Stellar blockchain',
    image: 'https://picsum.photos/300/300?random=3',
    owner: 'GBXY...3456',
    minted: 'Jun 19, 2026',
  },
];

function Gallery() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Simulate loading NFTs from Stellar
    setTimeout(() => {
      setNfts(sampleNFTs);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>⏳ Loading your NFTs...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div style={styles.empty}>
        <p>🖼️ No NFTs found</p>
        <p style={styles.emptyText}>
          Mint your first NFT to see it here!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏛️ NFT Gallery</h2>
      <p style={styles.count}>{nfts.length} NFTs found</p>

      {/* NFT Grid */}
      <div style={styles.grid}>
        {nfts.map((nft) => (
          <div
            key={nft.id}
            style={styles.card}
            onClick={() => setSelected(nft)}
          >
            <img
              src={nft.image}
              alt={nft.name}
              style={styles.image}
            />
            <div style={styles.cardBody}>
              <h3 style={styles.nftName}>{nft.name}</h3>
              <p style={styles.nftDesc}>{nft.description}</p>
              <p style={styles.nftDate}>📅 {nft.minted}</p>
            </div>
          </div>
        ))}
      </div>

      {/* NFT Detail Modal */}
      {selected && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <img
              src={selected.image}
              alt={selected.name}
              style={styles.modalImage}
            />
            <h2 style={styles.modalTitle}>{selected.name}</h2>
            <p style={styles.modalDesc}>{selected.description}</p>
            <p style={styles.modalOwner}>
              👤 Owner: {selected.owner}
            </p>
            <p style={styles.modalDate}>
              📅 Minted: {selected.minted}
            </p>
            <button
              style={styles.closeButton}
              onClick={() => setSelected(null)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    color: '#7c3aed',
    textAlign: 'center',
    marginBottom: '8px',
  },
  count: {
    color: '#888888',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid #333333',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '12px',
  },
  nftName: {
    color: '#ffffff',
    fontSize: '14px',
    marginBottom: '4px',
  },
  nftDesc: {
    color: '#888888',
    fontSize: '12px',
    marginBottom: '8px',
  },
  nftDate: {
    color: '#7c3aed',
    fontSize: '11px',
  },
  loading: {
    textAlign: 'center',
    color: '#888888',
    padding: '40px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#ffffff',
  },
  emptyText: {
    color: '#888888',
    fontSize: '14px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '360px',
    width: '100%',
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  modalTitle: {
    color: '#ffffff',
    marginBottom: '8px',
  },
  modalDesc: {
    color: '#888888',
    fontSize: '14px',
    marginBottom: '12px',
  },
  modalOwner: {
    color: '#7c3aed',
    fontSize: '13px',
    marginBottom: '4px',
  },
  modalDate: {
    color: '#888888',
    fontSize: '13px',
    marginBottom: '20px',
  },
  closeButton: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default Gallery;
