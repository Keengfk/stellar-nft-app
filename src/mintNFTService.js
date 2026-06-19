import * as StellarSdk from 'stellar-sdk';
import { server, networkPassphrase, getAccount } from './stellar';

// ================================
// IPFS UPLOAD SERVICE
// ================================

export const uploadToIPFS = async (imageFile, name, description) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', imageFile);

    // Upload image to IPFS via NFT.Storage
    const imageResponse = await fetch(
      'https://api.nft.storage/upload',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_NFT_STORAGE_KEY}`,
        },
        body: formData,
      }
    );

    const imageData = await imageResponse.json();
    const imageUrl = `https://ipfs.io/ipfs/${imageData.value.cid}`;

    // Create and upload metadata
    const metadata = {
      name,
      description,
      image: imageUrl,
      created: new Date().toISOString(),
      blockchain: 'Stellar',
    };

    const metadataResponse = await fetch(
      'https://api.nft.storage/upload',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_NFT_STORAGE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      }
    );

    const metadataData = await metadataResponse.json();
    return `https://ipfs.io/ipfs/${metadataData.value.cid}`;

  } catch (error) {
    throw new Error('IPFS upload failed: ' + error.message);
  }
};

// ================================
// NFT MINTING SERVICE
// ================================

export const mintNFT = async (
  issuerSecretKey,
  artName,
  metadataUrl
) => {
  try {
    const issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecretKey);
    const issuerPublicKey = issuerKeypair.publicKey();

    // Create unique asset code from art name
    const assetCode = artName
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .slice(0, 12);

    // Create NFT asset
    const nftAsset = new StellarSdk.Asset(assetCode, issuerPublicKey);

    // Load issuer account
    const account = await getAccount(issuerPublicKey);

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      // Store metadata URL on chain
      .addOperation(
        StellarSdk.Operation.manageData({
          name: 'nft_metadata',
          value: metadataUrl.slice(0, 64),
        })
      )
      // Issue exactly 1 NFT token
      .addOperation(
        StellarSdk.Operation.payment({
          destination: issuerPublicKey,
          asset: nftAsset,
          amount: '1',
        })
      )
      // Lock supply — no more can ever be minted
      .addOperation(
        StellarSdk.Operation.setOptions({
          masterWeight: 0,
        })
      )
      .setTimeout(30)
      .build();

    // Sign and submit
    transaction.sign(issuerKeypair);
    const result = await server.submitTransaction(transaction);

    return {
      success: true,
      hash: result.hash,
      assetCode,
      metadataUrl,
      issuer: issuerPublicKey,
    };

  } catch (error) {
    throw new Error('Minting failed: ' + error.message);
  }
};

// ================================
// FULL MINT FLOW
// ================================

export const mintNFTFull = async (
  issuerSecretKey,
  imageFile,
  artName,
  description,
  onStatusUpdate
) => {
  try {
    // Step 1 - Upload to IPFS
    onStatusUpdate('🔄 Uploading artwork to IPFS...');
    const metadataUrl = await uploadToIPFS(
      imageFile,
      artName,
      description
    );

    // Step 2 - Mint on Stellar
    onStatusUpdate('🔄 Minting NFT on Stellar...');
    const result = await mintNFT(
      issuerSecretKey,
      artName,
      metadataUrl
    );

    // Step 3 - Done!
    onStatusUpdate('✅ NFT Minted Successfully!');
    return result;

  } catch (error) {
    onStatusUpdate('❌ ' + error.message);
    throw error;
  }
};
