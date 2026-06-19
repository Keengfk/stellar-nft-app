import * as StellarSdk from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';
import {
  server,
  networkPassphrase,
  getAccount,
  isValidAddress,
} from './stellar';

// ================================
// CHECK TRUSTLINE
// ================================

export const hasTrustline = async (
  publicKey,
  assetCode,
  issuerPublicKey
) => {
  try {
    const account = await getAccount(publicKey);
    return account.balances.some(
      (balance) =>
        balance.asset_code === assetCode &&
        balance.asset_issuer === issuerPublicKey
    );
  } catch {
    return false;
  }
};

// ================================
// CREATE TRUSTLINE
// ================================

export const createTrustline = async (
  senderPublicKey,
  assetCode,
  issuerPublicKey
) => {
  try {
    const asset = new StellarSdk.Asset(assetCode, issuerPublicKey);
    const account = await getAccount(senderPublicKey);

    const transaction = new StellarSdk.TransactionBuilder(
      account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset,
          limit: '1',
        })
      )
      .setTimeout(30)
      .build();

    // Sign with Freighter
    const xdr = transaction.toXDR();
    const signedXdr = await signTransaction(xdr, {
      network: 'TESTNET',
    });

    const signedTransaction = StellarSdk.TransactionBuilder
      .fromXDR(signedXdr, networkPassphrase);

    return await server.submitTransaction(signedTransaction);

  } catch (error) {
    throw new Error('Trustline failed: ' + error.message);
  }
};

// ================================
// TRANSFER NFT
// ================================

export const transferNFT = async (
  senderPublicKey,
  recipientPublicKey,
  assetCode,
  issuerPublicKey,
  onStatusUpdate
) => {
  try {

    // Step 1 - Validate addresses
    onStatusUpdate('🔄 Validating addresses...');
    if (!isValidAddress(recipientPublicKey)) {
      throw new Error('Invalid recipient Stellar address!');
    }

    if (recipientPublicKey === senderPublicKey) {
      throw new Error('Cannot transfer to your own wallet!');
    }

    // Step 2 - Check trustline
    onStatusUpdate('🔄 Checking recipient trustline...');
    const trustlineExists = await hasTrustline(
      recipientPublicKey,
      assetCode,
      issuerPublicKey
    );

    if (!trustlineExists) {
      onStatusUpdate(
        '⚠️ Recipient needs to add a trustline first!'
      );
      throw new Error(
        'Recipient has no trustline for this NFT asset.'
      );
    }

    // Step 3 - Build transaction
    onStatusUpdate('🔄 Building transaction...');
    const asset = new StellarSdk.Asset(assetCode, issuerPublicKey);
    const account = await getAccount(senderPublicKey);

    const transaction = new StellarSdk.TransactionBuilder(
      account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: recipientPublicKey,
          asset,
          amount: '1',
        })
      )
      .setTimeout(30)
      .build();

    // Step 4 - Sign with Freighter
    onStatusUpdate('🔄 Please sign in Freighter wallet...');
    const xdr = transaction.toXDR();
    const signedXdr = await signTransaction(xdr, {
      network: 'TESTNET',
    });

    // Step 5 - Submit to Stellar
    onStatusUpdate('🔄 Submitting to Stellar network...');
    const signedTransaction = StellarSdk.TransactionBuilder
      .fromXDR(signedXdr, networkPassphrase);

    const result = await server.submitTransaction(
      signedTransaction
    );

    // Step 6 - Success!
    onStatusUpdate('✅ NFT Transferred Successfully!');

    return {
      success: true,
      hash: result.hash,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
    };

  } catch (error) {
    onStatusUpdate('❌ ' + error.message);
    throw error;
  }
};

// ================================
// GET TRANSACTION HISTORY
// ================================

export const getTransactionHistory = async (publicKey) => {
  try {
    const transactions = await server
      .transactions()
      .forAccount(publicKey)
      .order('desc')
      .limit(10)
      .call();

    return transactions.records.map((tx) => ({
      id: tx.id,
      hash: tx.hash,
      date: new Date(tx.created_at).toLocaleDateString(),
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${tx.hash}`,
    }));

  } catch (error) {
    return [];
  }
};
