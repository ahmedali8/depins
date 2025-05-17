import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bs58 = require('bs58');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const connection = new anchor.web3.Connection(
  'https://api.devnet.solana.com',
  'confirmed',
);

const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY;
const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  bs58.default.decode(WALLET_PRIVATE_KEY),
);
const wallet = new anchor.Wallet(walletKeypair);

const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: 'confirmed',
});

anchor.setProvider(provider);

const programId = new PublicKey('91nEh5GFUmUuubPrznpVwjC2Eo4ssrjk6dpUDEbgyuoi');

const idl = JSON.parse(fs.readFileSync('src/idls/stakingio.json', 'utf8'));
const program = new Program(idl, programId, provider);

const msolMint = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So');

(async () => {
  const msolAta = await getOrCreateAssociatedTokenAccount(
    connection,
    walletKeypair,
    msolMint,
    wallet.publicKey,
  );

  const amount = new anchor.BN(1 * 10 ** 9);
  const tx = await program.methods
    .marinadeDeposit(amount)
    .accounts({
      state: new anchor.web3.PublicKey(
        '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC',
      ),
      msolMint,
      liqPoolSolLegPda: new anchor.web3.PublicKey(
        'UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q',
      ),
      liqPoolMsolLeg: new anchor.web3.PublicKey(
        '7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE',
      ),
      liqPoolMsolLegAuthority: new anchor.web3.PublicKey(
        'EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL',
      ),
      reservePda: new anchor.web3.PublicKey(
        'Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN',
      ),
      transferFrom: wallet.publicKey,
      mintTo: msolAta.address,
      mintAuthority: new anchor.web3.PublicKey(
        '3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM',
      ),
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: new anchor.web3.PublicKey(
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      ),
      marinadeProgram: new anchor.web3.PublicKey(
        'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
      ),
    })
    .signers([walletKeypair])
    .rpc({ skipPreflight: true });
  await program.provider.connection.confirmTransaction(tx, 'finalized');
  console.log('Marinade Deposit Tx: ', tx);
})();
