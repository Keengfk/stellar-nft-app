import * as StellarSdk from 'stellar-sdk';

// ================================
// STELLAR NETWORK CONFIGURATION
// ================================

// Use Testnet for development
export const NETWORK = 'TESTNET';

export const server = new StellarSdk.Horizon.Server(
  'https://horizon-testnet.stellar.org'
);

export const networkPassphrase = StellarSdk.Networks.TESTNET;

// ================================
// ACCOUNT FUNCTIONS
// ================================

// Get account details from Stellar
export const getAccount = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    return account;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(
        'Account not found. Fund it at https://friendbot.stellar.org'
      );
    }
    throw error;
  }
};

// Fund a new Testnet account using Friendbot
export const fundTestnetAccount = async (publicKey) => {
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${publicKey}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Failed to fund account: ' + error.message);
  }
};

// Get XLM balance of an account
export const getBalance = async (publicKey) => {
  try {
    const account = await getAccount(publicKey);
    const xlmBalance = account.balances.find(
      (b) => b.asset_type === 'native'
    );
    return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
  } catch (error) {
    return 0;
  }
};

// ================================
// NFT FUNCTIONS
// ================================

// Create a unique NFT asset on Stellar
export const createNFTAsset = (assetCode, issuerPublicKey) => {
  // Asset code max 12 characters
  const code = assetCode.replace(/[^A-Z0-9]/gi, '').slice(0, 12);
  return new StellarSdk.Asset(code.toUpperCase(), issuerPublicKey);
};

// Get all NFTs owned by an account
export const getNFTs = async (publicKey) => {
  try {
    const account = await getAccount(publicKey);
    
    // Filter out native XLM, return only custom assets
    const nfts = account.balances.filter(
      (balance) =>
        balance.asset_type !== 'native' &&
        parseFloat(balance.balance) === 1
    );

    return nfts.map((nft) => ({
      code: nft.asset_code,
      issuer: nft.asset_issuer,
      balance: nft.balance,
    }));
  } catch (error) {
    return [];
  }
};

// ================================
// TRANSACTION HELPERS
// ================================

// Check if a Stellar address is valid
export const isValidAddress = (address) => {
  try {
    StellarSdk.Keypair.fromPublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Format a long Stellar address to short form
export const shortAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

// Format XLM balance
export const formatXLM = (amount) => {
  return parseFloat(amount).toFixed(2) + ' XLM';
};
