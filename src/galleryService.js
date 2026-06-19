import { server, getAccount, shortAddress } from './stellar';

// ================================
// FETCH NFT METADATA FROM IPFS
// ================================

export const fetchIPFSMetadata = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;

    // Convert IPFS URL to HTTP gateway URL
    const httpUrl = ipfsUrl.replace(
      'ipfs://',
      'https://ipfs.io/ipfs/'
    );

    const response = await fetch(httpUrl);
    const metadata = await response.json();
    return metadata;

  } catch (error) {
    console.error('Failed to fetch IPFS metadata:', error);
    return null;
  }
};

// ================================
// FETCH ALL NFTS FROM STELLAR
// ================================

export const fetchNFTs = async (publicKey) => {
  try {
    // Load account from Stellar
    const account = await getAccount(publicKey);

    // Filter assets with balance of exactly 1
    const nftBalances = account.balances.filter(
      (balance) =>
        balance.asset_type !== 'native' &&
        parseFloat(balance.balance) === 1
    );

    if (nftBalances.length === 0) return [];

    // Fetch metadata for each NFT
    const nftsWithMetadata = await Promise.all(
      nftBalances.map(async (nft) => {
        try {
          // Fetch account data for metadata URL
          const issuerAccount = await server
            .loadAccount(nft.asset_issuer);

          // Get metadata URL from account data
          const metadataEntry = issuerAccount.data_attr
            ? issuerAccount.data_attr['nft_metadata']
            : null;

          let metadata = null;
          if (metadataEntry) {
            const metadataUrl = Buffer.from(
              metadataEntry,
              'base64'
            ).toString('utf-8');
            metadata = await fetchIPFSMetadata(metadataUrl);
          }

          return {
            id: `${nft.asset_code}-${nft.asset_issuer}`,
            code: nft.asset_code,
            issuer: nft.asset_issuer,
            issuerShort: shortAddress(nft.asset_issuer),
            balance: nft.balance,
            name: metadata?.name || nft.asset_code,
            description:
              metadata?.description || 'No description available',
            image:
              metadata?.image ||
              `https://picsum.photos/300/300?random=${nft.asset_code}`,
            minted: metadata?.created
              ? new Date(metadata.created).toLocaleDateString()
              : 'Unknown',
          };
        } catch (error) {
          // Return basic NFT info if metadata fails
          return {
            id: `${nft.asset_code}-${nft.asset_issuer}`,
            code: nft.asset_code,
            issuer: nft.asset_issuer,
            issuerShort: shortAddress(nft.asset_issuer),
            balance: nft.balance,
            name: nft.asset_code,
            description: 'Metadata unavailable',
            image: `https://picsum.photos/300/300?random=${nft.asset_code}`,
            minted: 'Unknown',
          };
        }
      })
    );

    return nftsWithMetadata;

  } catch (error) {
    console.error('Failed to fetch NFTs:', error);
    return [];
  }
};

// ================================
// FETCH SINGLE NFT DETAILS
// ================================

export const fetchNFTDetails = async (assetCode, issuerPublicKey) => {
  try {
    const issuerAccount = await server.loadAccount(issuerPublicKey);

    const metadataEntry = issuerAccount.data_attr
      ? issuerAccount.data_attr['nft_metadata']
      : null;

    let metadata = null;
    if (metadataEntry) {
      const metadataUrl = Buffer.from(
        metadataEntry,
        'base64'
      ).toString('utf-8');
      metadata = await fetchIPFSMetadata(metadataUrl);
    }

    return {
      code: assetCode,
      issuer: issuerPublicKey,
      issuerShort: shortAddress(issuerPublicKey),
      name: metadata?.name || assetCode,
      description: metadata?.description || 'No description',
      image: metadata?.image || null,
      minted: metadata?.created
        ? new Date(metadata.created).toLocaleDateString()
        : 'Unknown',
      blockchain: 'Stellar Testnet',
    };

  } catch (error) {
    throw new Error('Failed to fetch NFT details: ' + error.message);
  }
};

// ================================
// SEARCH NFTS
// ================================

export const searchNFTs = (nfts, query) => {
  if (!query) return nfts;
  const lower = query.toLowerCase();
  return nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(lower) ||
      nft.description.toLowerCase().includes(lower) ||
      nft.code.toLowerCase().includes(lower)
  );
};
