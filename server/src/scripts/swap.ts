import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';
import {
  createAssociatedTokenAccount,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bs58 = require('bs58');

const connection = new anchor.web3.Connection('https://api.devnet.solana.com', {
  commitment: 'finalized',
});

const programId = new PublicKey('91nEh5GFUmUuubPrznpVwjC2Eo4ssrjk6dpUDEbgyuoi');

const swapAccounts = {
  token0: 'So11111111111111111111111111111111111111112',
  token1: 'tVRuMWjtNDJt8yz89KTtdUEjZXMEo5NwoSvubjYq9zV',
  token0Vault: 'GeCyAc8Ct2T1njpbEU2GtmwXnYzBMcaAoGLdFxPeb9zJ',
  token1Vault: 'GAcpt2Zsfz91RyvLeMUP21w59oEg1Dhfu6PgPhNNdag4',
  cpSwapProgram: 'CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW',
  ammConfig: '9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6',
  poolState: 'HeckguqBrrgquJscbkU2VXkRuVPLJgD8J8MQqX42jMkR',
  authority: '7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw',
  lpMint: '9RfnsWN7y6VrxhkA8G3vTZyanLPyosoDuLuxcxUkXJDZ',
  userLpTokenVault: '4Q5DHXcDaV3NZ9RRTjcATHYquyYf6CwawMwdZ7QWQtrt',
  createPoolFee: 'G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2',
};

const grassTokenMint = new PublicKey(
  'tVRuMWjtNDJt8yz89KTtdUEjZXMEo5NwoSvubjYq9zV',
);

const raydiumProgramId = new PublicKey(
  'CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW',
);

// const WALLET_PRIVATE_KEY =
//   '5RVmj2xDszpuM9Wjj1RwNiaf9De3Nb1vKJLBm6YHwngQrp3T5U2G16LYKeHobdXQRhZ623TkxCxr3LtuhgYVvE5N';

// const adminWalletKeypair = anchor.web3.Keypair.fromSecretKey(
//   // new Uint8Array(Buffer.from(WALLET_PRIVATE_KEY, 'base64')),
//   bs58.default.decode(WALLET_PRIVATE_KEY),
// );
// const adminWallet = new anchor.Wallet(adminWalletKeypair);

const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(
    Buffer.from(
      'iSEgd3ypaKYv9tB83O8J1yDH5jngkrMsmevoQaKdkHchRIyWpnx/noMFjMu9eepgqk7nUt2XMU/N8tuGdGTeNg==',
      'base64',
    ),
  ),
);
const wallet = new anchor.Wallet(walletKeypair);
// const provider = new anchor.AnchorProvider(connection, adminWallet, {
//   commitment: 'finalized',
// });

// anchor.setProvider(provider);

(async () => {
  const connection = new anchor.web3.Connection(
    'https://api.devnet.solana.com',
    'confirmed',
  );

  const walletKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(
      Buffer.from(
        'iSEgd3ypaKYv9tB83O8J1yDH5jngkrMsmevoQaKdkHchRIyWpnx/noMFjMu9eepgqk7nUt2XMU/N8tuGdGTeNg==',
        'base64',
      ),
    ),
  );
  const wallet = new anchor.Wallet(walletKeypair);

  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });

  anchor.setProvider(provider);

  const userGrassAta = await getOrCreateAssociatedTokenAccount(
    connection,
    walletKeypair,
    new anchor.web3.PublicKey('tVRuMWjtNDJt8yz89KTtdUEjZXMEo5NwoSvubjYq9zV'),
    wallet.publicKey,
  );
  console.log('🚀 ~ AppController ~ optimiser ~ userGrassAta:', userGrassAta);
})();

// const idl = JSON.parse(fs.readFileSync('src/idls/stakingio.json', 'utf8'));
// const program = new Program(idl, programId, provider);

// async function getObservationAddress() {
//   const ORACLE_SEED = Buffer.from(
//     anchor.utils.bytes.utf8.encode('observation'),
//   );

//   const poolIdBuffer = new PublicKey(swapAccounts.poolState).toBuffer();

//   const [address] = await PublicKey.findProgramAddress(
//     [ORACLE_SEED, poolIdBuffer],
//     raydiumProgramId,
//   );

//   return address;
// }

// (async () => {
//   const amountGrassIn = new anchor.BN(6000 * 10 ** 9); // 0.0000001 Grass
//   const amountWSolOut = new anchor.BN(900); //0.00000009 WSol

//   const observationState = await getObservationAddress();

//   try {
//     const userToken0Account = await getOrCreateAssociatedTokenAccount(
//       connection,
//       walletKeypair,
//       new PublicKey(swapAccounts.token0),
//       wallet.publicKey,
//     );

//     const userToken1Account = await getOrCreateAssociatedTokenAccount(
//       connection,
//       walletKeypair,
//       new PublicKey(swapAccounts.token1),
//       wallet.publicKey,
//     );

//     const tx = await program.methods
//       .swapGrassForSol(amountGrassIn, amountWSolOut, grassTokenMint)
//       .accounts({
//         payer: wallet.publicKey,
//         authority: swapAccounts.authority,
//         ammConfig: swapAccounts.ammConfig,
//         poolState: swapAccounts.poolState,
//         token0Account: userToken0Account.address,
//         token1Account: userToken1Account.address,
//         token0Mint: swapAccounts.token0,
//         token1Mint: swapAccounts.token1,
//         observationState,
//         poolVaultToken0: swapAccounts.token0Vault,
//         poolVaultToken1: swapAccounts.token1Vault,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//         raydiumSwapProgram: raydiumProgramId,
//       })
//       .signers([walletKeypair])
//       .rpc({
//         skipPreflight: true,
//       });

//     console.log('tx -->', tx);

//     await program.provider.connection.confirmTransaction(tx, 'finalized');
//     console.log('Swap Tx:', tx);
//   } catch (e) {
//     console.error('Error sending tx -> ', e);
//   }
// })();
