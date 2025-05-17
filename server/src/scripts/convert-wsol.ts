import * as anchor from '@coral-xyz/anchor';
import { getAssociatedTokenAddress, closeAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bs58 = require('bs58');

const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

const connection = new anchor.web3.Connection(
  'https://api.devnet.solana.com',
  'confirmed',
);

const WALLET_PRIVATE_KEY =
  '5RVmj2xDszpuM9Wjj1RwNiaf9De3Nb1vKJLBm6YHwngQrp3T5U2G16LYKeHobdXQRhZ623TkxCxr3LtuhgYVvE5N';
const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  bs58.default.decode(WALLET_PRIVATE_KEY),
);
const wallet = new anchor.Wallet(walletKeypair);

async function unwrapWSOL() {
  const ata = await getAssociatedTokenAddress(WSOL_MINT, wallet.publicKey);

  const closeAccountTx = await closeAccount(
    connection,
    walletKeypair,
    ata,
    wallet.publicKey,
    walletKeypair,
  );
  console.log('🚀 ~ unwrapWSOL ~ closeAccountTx:', closeAccountTx);
}

unwrapWSOL();
