import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';
import { join } from 'path';
import { existsSync } from 'fs';
import { User, UserDesktop } from 'src/database';
import { CONSTANTS, CronJobsService } from '../cron-jobs/cron-jobs.service';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { decrypt } from 'src/scripts/crypto';
import * as fs from 'fs';
import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import axios from 'axios';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bs58 = require('bs58');

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cjService: CronJobsService,
  ) {}

  @Post('send-spl-token/:pubkey')
  async sendSplToken(@Param('pubkey') pubkey: string) {
    const user = await User.findOne({
      where: {
        walletPublicKey: pubkey,
      },
    });

    const userPrivateKey = decrypt(user.walletPrivateKey);

    const connection = new anchor.web3.Connection(
      'https://api.devnet.solana.com',
      {
        commitment: 'finalized',
      },
    );

    const adminWalletKeypair = anchor.web3.Keypair.fromSecretKey(
      bs58.default.decode(process.env.PRIVATE_KEY),
    );
    const adminWallet = new anchor.Wallet(adminWalletKeypair);

    const walletKeypair = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(Buffer.from(userPrivateKey, 'base64')),
    );
    const wallet = new anchor.Wallet(walletKeypair);

    const sourceAta = await this.cjService.getOrCreateATA(
      connection,
      adminWalletKeypair,
      adminWallet.publicKey,
      CONSTANTS.GRASS_TOKEN_MINT,
    );
    console.log('🚀 ~ AppController ~ sendSplToken ~ sourceAta:', sourceAta);

    const solBalance = await this.cjService.getSolBalance(wallet.publicKey);

    if (solBalance < 0.5) {
      await this.cjService.airdropSol(wallet.publicKey, 2);
    }

    const destinationAta = await this.cjService.getOrCreateATA(
      connection,
      walletKeypair,
      wallet.publicKey,
      CONSTANTS.GRASS_TOKEN_MINT,
    );
    console.log(
      '🚀 ~ AppController ~ sendSplToken ~ destinationAta:',
      destinationAta,
    );

    const tx = new Transaction();

    const amountBuffer = new anchor.BN(2000 * 10 ** 9).toArray('le', 8);
    const data = Buffer.alloc(9);
    data[0] = 3;
    data.set(amountBuffer, 1);
    const transferInstruction = new TransactionInstruction({
      keys: [
        { pubkey: sourceAta, isSigner: false, isWritable: true },
        { pubkey: destinationAta, isSigner: false, isWritable: true },
        { pubkey: adminWallet.publicKey, isSigner: true, isWritable: false },
      ],
      programId: TOKEN_PROGRAM_ID,
      data,
    });

    tx.add(transferInstruction);

    const sig = await sendAndConfirmTransaction(
      connection,
      tx,
      [adminWalletKeypair],
      {
        skipPreflight: true,
      },
    );

    user.grassEarned = Number(user.grassEarned) + 2000;
    await user.save();

    console.log('SPL token transferred with tx:', sig);
  }

  @Get('user/get-keys/:pubkey')
  async getUserKeys(@Param('pubkey') pubkey: string) {
    const user = await User.findOne({
      where: {
        walletPublicKey: pubkey,
      },
    });
    console.log('🚀 ~ AppController ~ getUserKeys ~ user:', user);

    return {
      ...user,
      walletPrivateKey: decrypt(user.walletPrivateKey),
    };
  }

  @Get('user/details/:pubkey')
  async getUserDetails(@Param('pubkey') pubkey: string) {
    const user = await User.findOne({
      where: {
        walletPublicKey: pubkey,
      },
    });
    console.log('🚀 ~ AppController ~ getUserDetails ~ pp user:', user);

    let solPrice = 173;

    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=solana`,
      );
      solPrice = res?.data?.solana?.usd || 173;
    } catch (e) {}

    const connection = new anchor.web3.Connection(
      'https://api.devnet.solana.com',
      {
        commitment: 'confirmed',
      },
    );

    const userPrivateKey = decrypt(user.walletPrivateKey);
    console.log(
      '🚀 ~ CronJobsService ~ allUsers.map ~ userPrivateKey:',
      userPrivateKey,
    );

    const walletKeypair = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(Buffer.from(userPrivateKey, 'base64')),
    );
    const wallet = new anchor.Wallet(walletKeypair);

    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });

    anchor.setProvider(provider);

    const msolMint = new PublicKey(
      'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    );

    const solBalance = await this.cjService.getSolBalance(wallet.publicKey);

    if (solBalance < 0.1) {
      await this.cjService.airdropSol(wallet.publicKey, 0.5);
    }

    // Create user mSOL token account
    const userMsolAta = await this.cjService.getOrCreateATA(
      connection,
      walletKeypair,
      wallet.publicKey,
      msolMint,
    );

    const userMsolBalance = await this.cjService.getAtaBalance(userMsolAta);
    console.log(
      '🚀 ~ AppController ~ withdrawFunds ~ userMsolBalance:',
      userMsolBalance,
    );

    return {
      totalValue: user.marinadeDespoited * solPrice,
      marinadeDeposit: userMsolBalance / 10 ** 9,
      totalGrassEarned: parseFloat(user.grassEarned.toString()),
    };
  }

  @Post('withdraw/:pubkey')
  async withdrawFunds(@Param('pubkey') pubkey: string) {
    const user = await User.findOne({
      where: {
        walletPublicKey: pubkey,
      },
    });
    console.log('🚀 ~ AppController ~ withdrawFunds ~ user:', user);

    if (!user) throw new UnauthorizedException();

    const connection = new anchor.web3.Connection(
      'https://api.devnet.solana.com',
      {
        commitment: 'finalized',
      },
    );

    const userPrivateKey = decrypt(user.walletPrivateKey);
    console.log(
      '🚀 ~ CronJobsService ~ allUsers.map ~ userPrivateKey:',
      userPrivateKey,
    );

    const walletKeypair = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(Buffer.from(userPrivateKey, 'base64')),
    );
    const wallet = new anchor.Wallet(walletKeypair);

    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'finalized',
    });

    anchor.setProvider(provider);

    const idl = JSON.parse(fs.readFileSync('src/idls/stakingio.json', 'utf8'));
    const program = new Program(idl, CONSTANTS.PROGRAM_ID, provider);

    const msolMint = new PublicKey(
      'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    );
    console.log('msolMint:', msolMint.toBase58());
    // Create user mSOL token account
    const userMsolAta = await this.cjService.getOrCreateATA(
      connection,
      walletKeypair,
      wallet.publicKey,
      msolMint,
    );

    const userMsolBalance = await this.cjService.getAtaBalance(userMsolAta);
    console.log(
      '🚀 ~ AppController ~ withdrawFunds ~ userMsolBalance:',
      userMsolBalance,
    );

    if (userMsolBalance < 0) return 'No amount to withdraw';

    user.amountWithdrawn =
      Number(user.amountWithdrawn) + userMsolBalance / 10 ** 9;
    user.marinadeDespoited = 0;
    await user.save();

    const tx = await program.methods
      .liquidUnstake(new anchor.BN(userMsolBalance))
      .accounts({
        state: new anchor.web3.PublicKey(
          '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC',
        ),
        msolMint: msolMint,
        liqPoolSolLegPda: new anchor.web3.PublicKey(
          'UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q',
        ),
        liqPoolMsolLeg: new anchor.web3.PublicKey(
          '7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE',
        ),
        treasuryMsolAccount: new anchor.web3.PublicKey(
          '8ZUcztoAEhpAeC2ixWewJKQJsSUGYSGPVAjkhDJYf5Gd',
        ),
        getMsolFrom: userMsolAta,
        getMsolFromAuthority: provider.wallet.publicKey,
        transferSolTo: provider.wallet.publicKey,
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

    await user.save();

    const url = `https://solscan.io/tx/${tx}?cluster=devnet`;

    return url;
  }

  @Get('optimiser')
  async optimiser() {
    return await this.cjService.optimiser();
  }

  @Get('install/:os/:pubkey')
  download(
    @Param('os') os: string,
    @Param('pubkey') pubkey: string,
    @Res() res: Response,
  ) {
    const filename =
      os.toLowerCase() === 'linux'
        ? 'ubuntu.install.sh'
        : os.toLowerCase() === 'macos'
          ? 'mac.install.sh'
          : 'windows.install.bat';

    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'scripts',
      filename,
    );

    if (!existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/__PUBKEY__/g, pubkey);

    res.set({
      'Content-Disposition': `attachment; filename="install.${os.toLowerCase() === 'windows' ? 'bat' : 'sh'}`,
      'Content-Type': `application/x-${os.toLowerCase() === 'windows' ? 'bat' : 'sh'}`,
    });

    res.send(content);
  }

  @Get('anydesk-id/:id')
  async getAnyDeskId(
    @Param('id') id: string,
    @Headers('x-pubkey') pubkey: string,
  ) {
    await UserDesktop.create({
      walletPublicKey: pubkey,
      anydeskId: id,
    }).save();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('infinity')
  infinity() {
    while (true) {}
  }
}
