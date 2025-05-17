import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  closeAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { UserService } from '../user/user.service';
import { User } from 'src/database';
import { decrypt } from 'src/scripts/crypto';
import * as fs from 'fs';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { emitToUser, getAllUsers, getSocketServer } from 'src/socket.io';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bs58 = require('bs58');

const connection = new anchor.web3.Connection('https://api.devnet.solana.com', {
  commitment: 'finalized',
});

export const CONSTANTS = {
  GRASS_TOKEN_MINT: new anchor.web3.PublicKey(
    'tVRuMWjtNDJt8yz89KTtdUEjZXMEo5NwoSvubjYq9zV',
  ),
  GRASS_TOKEN_DECIMALS: 9,
  PROGRAM_ID: new anchor.web3.PublicKey(
    'EvJosfRmixqfVpEGj93btamJ8S1bquw8PGHjZxqs2XKR',
  ),
  RAYDIUM_PROGRAM_ID: new anchor.web3.PublicKey(
    'CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW',
  ),
  WSOL_MINT: new PublicKey('So11111111111111111111111111111111111111112'),
  MSOL_MINT: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
};

const MARINADE_CONSTANTS = {
  STATE: new PublicKey('8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC'),
  MSOL_MINT: null, // Replace with actual mSOL mint if needed
  LIQ_POOL_SOL_LEG_PDA: new PublicKey(
    'UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q',
  ),
  LIQ_POOL_MSOL_LEG: new PublicKey(
    '7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE',
  ),
  LIQ_POOL_MSOL_LEG_AUTHORITY: new PublicKey(
    'EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL',
  ),
  RESERVE_PDA: new PublicKey('Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN'),
  MINT_AUTHORITY: new PublicKey('3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM'),
  SYSTEM_PROGRAM: new PublicKey('11111111111111111111111111111111'),
  TOKEN_PROGRAM: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  MARINADE_PROGRAM: new PublicKey(
    'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
  ),
};

const adminWalletKeypair = anchor.web3.Keypair.fromSecretKey(
  bs58.default.decode(process.env.PRIVATE_KEY),
);
const adminWallet = new anchor.Wallet(adminWalletKeypair);

const provider = new anchor.AnchorProvider(connection, adminWallet, {
  commitment: 'finalized',
});

anchor.setProvider(provider);

const idl = JSON.parse(fs.readFileSync('src/idls/stakingio.json', 'utf8'));
const program = new Program(idl, CONSTANTS.PROGRAM_ID, provider);

@Injectable()
export class CronJobsService {
  constructor(private readonly userService: UserService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  ping() {
    const io = getSocketServer();
    // io.emit('ping', 'Hello from server');

    const users = getAllUsers();

    users.forEach((user, userId) => {
      console.log('emitting --> ', user, userId);

      io.to(user).emit('ping', `pinging to user ${userId}`);
    });
  }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async optimiser() {
    console.log('rnning opt');

    /**
     * 1. loop over all the users
     * 2. fetch GRASS token account of each user using the user public key
     * 3. swap each user GRASS token for SOL
     * 4. unwrap SOL
     * 5. deposit SOL in marinade finanace
     */

    const allUsers = await User.find();

    return await Promise.all(
      allUsers.map(async (user) => {
        // ? ===================================================================================================================
        // ? STEP: 01

        console.log('STEP 01: GETTING USER GRASS TOKENS');

        const userPrivateKey = decrypt(user.walletPrivateKey);
        console.log(
          '🚀 ~ CronJobsService ~ allUsers.map ~ userPrivateKey:',
          userPrivateKey,
        );

        const walletKeypair = anchor.web3.Keypair.fromSecretKey(
          new Uint8Array(Buffer.from(userPrivateKey, 'base64')),
        );
        const wallet = new anchor.Wallet(walletKeypair);

        const solBalance = await this.getSolBalance(wallet.publicKey);
        console.log(
          '🚀 ~ CronJobsService ~ allUsers.map ~ solBalance:',
          solBalance,
        );

        if (solBalance < 0.5) {
          try {
            await this.airdropSol(wallet.publicKey, 0.5);
          } catch (e) {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await this.airdropSol(wallet.publicKey, 0.5);
          }
        }

        console.log('getting ATA');

        const userGrassAta = await this.getOrCreateATA(
          connection,
          walletKeypair,
          wallet.publicKey,
          CONSTANTS.GRASS_TOKEN_MINT,
        );

        const userGrassAtaAmount = await this.getAtaBalance(userGrassAta);

        console.log(
          '🚀 ~ CronJobsService ~ allUsers.map ~ userGrassAta:',
          userGrassAta.toString(),
          userGrassAtaAmount,
        );

        const grassTokenAmount =
          userGrassAtaAmount / 10 ** CONSTANTS.GRASS_TOKEN_DECIMALS;

        console.log('grassTokenAmount --> ', grassTokenAmount);

        if (grassTokenAmount <= 0) return;

        const swapAccounts = this.getSwapAccounts();

        const amountGrassIn = new anchor.BN(userGrassAtaAmount);
        const amountWSolOut = new anchor.BN(900);

        const userSolAta = await this.getOrCreateATA(
          connection,
          walletKeypair,
          wallet.publicKey,
          new anchor.web3.PublicKey(swapAccounts.token0),
        );
        console.log(
          '🚀 ~ CronJobsService ~ allUsers.map ~ userSolAta:',
          userSolAta.toString(),
        );

        const observationState = await this.getObservationAddress();

        // ? ===================================================================================================================
        // ? STEP: 02

        emitToUser(user.walletPublicKey, 'message', {
          stepNumber: 0,
          stepText: 'Optimisation of funds started',
        });

        console.log('STEP 02: SWAPPING ALL AVAILABLE GRASS TOKENS FOR WSOL');

        emitToUser(user.walletPublicKey, 'message', {
          stepNumber: 1,
          stepText: `Swapping ${grassTokenAmount} GRASS`,
        });

        const tx = await program.methods
          .swapGrassForSol(
            amountGrassIn,
            amountWSolOut,
            CONSTANTS.GRASS_TOKEN_MINT,
          )
          .accounts({
            payer: wallet.publicKey,
            authority: swapAccounts.authority,
            ammConfig: swapAccounts.ammConfig,
            poolState: swapAccounts.poolState,
            token0Account: userSolAta,
            token1Account: userGrassAta,
            token0Mint: swapAccounts.token0,
            token1Mint: swapAccounts.token1,
            observationState,
            poolVaultToken0: swapAccounts.token0Vault,
            poolVaultToken1: swapAccounts.token1Vault,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            raydiumSwapProgram: CONSTANTS.RAYDIUM_PROGRAM_ID,
          })
          .signers([walletKeypair])
          .rpc({
            skipPreflight: true,
          });

        console.log('swap completed tx -->', tx);

        emitToUser(user.walletPublicKey, 'message', {
          stepNumber: 1,
          stepText: `Swap completed. View tx at`,
          stepUrl: `https://solscan.io/tx/${tx}?cluster=devnet`,
        });

        await program.provider.connection.confirmTransaction(tx, 'finalized');

        // ? ===================================================================================================================
        // ? STEP: 03

        console.log('STEP 03: UNWRAPING WSOL TO GET SOL');

        emitToUser(user.walletPublicKey, 'message', {
          stepNumber: 2,
          stepText: `Converting WSOL to SOL`,
        });

        const wsolAta = this.getAssociatedTokenAddress(
          wallet.publicKey,
          CONSTANTS.WSOL_MINT,
        );

        const wsolBalance = await this.getAtaBalance(wsolAta);

        const closeAccountTx = await closeAccount(
          connection,
          walletKeypair,
          wsolAta,
          wallet.publicKey,
          walletKeypair,
        );

        emitToUser(user.walletPublicKey, 'message', {
          stepNumber: 2,
          stepText: `Conversion completed. View tx at`,
          stepUrl: `https://solscan.io/tx/${closeAccountTx}?cluster=devnet`,
        });

        console.log('convert WSOL to SOL tx --> ', closeAccountTx);

        // ? ===================================================================================================================
        // ? STEP: 04

        console.log('STEP 04: DEPOSITING IN MARINADE');

        emitToUser(user.walletPublicKey, 'message', {
          stepNumber: 3,
          stepText: `Depositing ${wsolBalance / 10 ** 9} SOL in Marinade.Finance`,
        });

        const msolAta = await this.getOrCreateATA(
          connection,
          walletKeypair,
          wallet.publicKey,
          CONSTANTS.MSOL_MINT,
        );
        console.log('🚀 ~ CronJobsService ~ allUsers.map ~ msolAta:', msolAta);

        console.log('wsolBalance --> ', wsolBalance);

        const amount = new anchor.BN(wsolBalance);
        console.log('🚀 ~ CronJobsService ~ allUsers.map ~ amount:', amount);

        const marinadeDespoited = user.marinadeDespoited || 0;
        user.marinadeDespoited =
          Number(marinadeDespoited) + wsolBalance / 10 ** 9;

        const marinadeDepositTx = await program.methods
          .marinadeDeposit(amount)
          .accounts({
            state: MARINADE_CONSTANTS.STATE,
            msolMint: CONSTANTS.MSOL_MINT,
            liqPoolSolLegPda: MARINADE_CONSTANTS.LIQ_POOL_SOL_LEG_PDA,
            liqPoolMsolLeg: MARINADE_CONSTANTS.LIQ_POOL_MSOL_LEG,
            liqPoolMsolLegAuthority:
              MARINADE_CONSTANTS.LIQ_POOL_MSOL_LEG_AUTHORITY,
            reservePda: MARINADE_CONSTANTS.RESERVE_PDA,
            transferFrom: wallet.publicKey,
            mintTo: msolAta,
            mintAuthority: MARINADE_CONSTANTS.MINT_AUTHORITY,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            marinadeProgram: MARINADE_CONSTANTS.MARINADE_PROGRAM,
          })
          .signers([walletKeypair])
          .rpc({ skipPreflight: true });

        await user.save();

        await program.provider.connection.confirmTransaction(
          marinadeDepositTx,
          'finalized',
        );

        emitToUser(user.walletPublicKey, 'message', {
          stepNumber: 3,
          stepText: `Deposit completed. View tx at`,
          stepUrl: `https://solscan.io/tx/${marinadeDepositTx}?cluster=devnet`,
        });

        return {
          swapTx: tx,
          marinadeDespositTx: marinadeDepositTx,
        };
      }),
    );
  }

  getSwapAccounts() {
    return {
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
  }

  async getObservationAddress() {
    const swapAccounts = this.getSwapAccounts();

    const ORACLE_SEED = Buffer.from(
      anchor.utils.bytes.utf8.encode('observation'),
    );

    const poolIdBuffer = new anchor.web3.PublicKey(
      swapAccounts.poolState,
    ).toBuffer();

    const [address] = await anchor.web3.PublicKey.findProgramAddress(
      [ORACLE_SEED, poolIdBuffer],
      CONSTANTS.RAYDIUM_PROGRAM_ID,
    );

    return address;
  }

  async airdropSol(publicKey: PublicKey, amountInSol: number) {
    try {
      // Convert SOL amount to lamports (1 SOL = 1,000,000,000 lamports)
      const lamports = amountInSol * LAMPORTS_PER_SOL;

      // Request airdrop
      const signature = await connection.requestAirdrop(publicKey, lamports);

      // Confirm transaction
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      console.log(`Airdrop successful! Tx signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error('Airdrop failed:', error);
      throw error;
    }
  }

  async getSolBalance(publicKey: PublicKey) {
    const lamports = await connection.getBalance(publicKey);

    // Convert to SOL
    return lamports / LAMPORTS_PER_SOL;
  }

  getAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMint: PublicKey,
  ): PublicKey {
    return PublicKey.findProgramAddressSync(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )[0];
  }

  async doesTokenAccountExist(
    connection: Connection,
    tokenAccount: PublicKey,
  ): Promise<boolean> {
    const accountInfo = await connection.getAccountInfo(tokenAccount);
    return accountInfo !== null;
  }

  async createAssociatedTokenAccount(
    connection: Connection,
    payer: Keypair, // Who pays for the TX
    walletAddress: PublicKey, // Owner of the ATA
    tokenMint: PublicKey,
  ): Promise<string> {
    const associatedToken = this.getAssociatedTokenAddress(
      walletAddress,
      tokenMint,
    );
    console.log('🚀 ~ CronJobsService ~ associatedToken:', associatedToken);

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [
          { pubkey: payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: associatedToken, isSigner: false, isWritable: true },
          { pubkey: walletAddress, isSigner: false, isWritable: false },
          { pubkey: tokenMint, isSigner: false, isWritable: false },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          {
            pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.alloc(0), // No data needed
      }),
    );

    return await sendAndConfirmTransaction(connection, transaction, [payer]);
  }

  async getOrCreateATA(
    connection: Connection,
    payer: Keypair,
    owner: PublicKey,
    tokenMint: PublicKey,
  ): Promise<PublicKey> {
    const ata = this.getAssociatedTokenAddress(owner, tokenMint);
    const exists = await this.doesTokenAccountExist(connection, ata);

    if (!exists) {
      console.log("ATA doesn't exist. Creating...");
      await this.createAssociatedTokenAccount(
        connection,
        payer,
        owner,
        tokenMint,
      );
    } else {
      console.log('ATA already exists:', ata.toString());
    }

    return ata;
  }

  async getAtaBalance(ataAddress: PublicKey) {
    const accInfo = await connection.getAccountInfo(ataAddress);

    const data = accInfo.data;
    const amountData = data.slice(64, 72);
    const amount = Number(amountData.readBigUInt64LE(0));

    return amount;
  }
}
