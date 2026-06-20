import * as StellarSdk from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const CONTRACT_ID = 'CBU7UVJM7FAXB7AHCDMTKVJSUEE3PVTV2ROFOKO2P3IC4IKRTB45IHFA';
const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.SorobanRpc.Server(RPC_URL);

export const mintNFTOnChain = async (userPublicKey, name, description, imageUri) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const account = await server.getAccount(userPublicKey);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'mint',
          StellarSdk.nativeToScVal(userPublicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(name, { type: 'string' }),
          StellarSdk.nativeToScVal(description, { type: 'string' }),
          StellarSdk.nativeToScVal(imageUri, { type: 'string' })
        )
      )
      .setTimeout(30)
      .build();

    const prepared = await server.prepareTransaction(transaction);
    const xdr = prepared.toXDR();
    const signedXdr = await signTransaction(xdr, { network: 'TESTNET' });
    const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const result = await server.sendTransaction(signedTransaction);

    let response = await server.getTransaction(result.hash);
    while (response.status === 'NOT_FOUND') {
      await new Promise((r) => setTimeout(r, 1500));
      response = await server.getTransaction(result.hash);
    }

    if (response.status === 'SUCCESS') {
      const tokenId = StellarSdk.scValToNative(response.returnValue);
      return { success: true, tokenId, hash: result.hash };
    } else {
      throw new Error('Transaction failed: ' + response.status);
    }
  } catch (error) {
    throw new Error('Minting failed: ' + error.message);
  }
};

export const getTokenOwner = async (tokenId) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const account = await server.getAccount(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
    );

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call('owner_of', StellarSdk.nativeToScVal(tokenId, { type: 'u32' }))
      )
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(transaction);
    return StellarSdk.scValToNative(simulated.result.retval);
  } catch (error) {
    return null;
  }
};

export const getTotalSupply = async () => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const account = await server.getAccount(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
    );

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('total_supply'))
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(transaction);
    return StellarSdk.scValToNative(simulated.result.retval);
  } catch (error) {
    return 0;
  }
};

export { CONTRACT_ID };
