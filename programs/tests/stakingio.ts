import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import fs, { readFileSync } from 'fs';
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ComputeBudgetProgram, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createMint, createSyncNativeInstruction, getAccount, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo, NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createTokenWithMetadata, getAuthAddress, getOracleAccountAddress, getPoolAddress, getPoolLpMintAddress, getPoolVaultAddress } from "./utils";
import { RaydiumCpSwap } from "./types/raydium_cp_swap";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";


describe("stakingio", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const idl = JSON.parse(fs.readFileSync('./target/idl/stakingio.json', 'utf8'));
  const programId = new anchor.web3.PublicKey('EvJosfRmixqfVpEGj93btamJ8S1bquw8PGHjZxqs2XKR');
  const program = new Program(idl, programId, provider);
  let payer: anchor.web3.Keypair;
  let wallet: NodeWallet;
  let msolMint: PublicKey;
  let user: Keypair;
  let userMsolAccount: PublicKey;
  let protocolSolAccount: PublicKey;
  let protocolMsolAccount: PublicKey;
  let tokenVault: PublicKey;
  let grassMint: PublicKey;
  let TOKEN_METADATA_PROGRAM_ID: PublicKey;
  let metadataAddress: PublicKey;
  let userTokenAccount: PublicKey;
  let userToken0Account: PublicKey;
  let userToken1Account: PublicKey;
  let vaultTokenAccount: PublicKey;
  let auth: PublicKey;
  let poolState: PublicKey;
  let lpMintAddress: PublicKey;
  let vault0: PublicKey;
  let vault1: PublicKey;
  let observationAddress: PublicKey;
  let LAMPORTS_THRESHOLD: number;
  let token0: PublicKey;
  let token1: PublicKey;
  let raydiumSwapProgramID: PublicKey;
  let ammConfig: PublicKey;
  let createPoolFee: PublicKey;
  let userWSolAccount: PublicKey;
  let userLpTokenVault: PublicKey;

  before(" before hook", async () => {
    user = payer;
    wallet = provider.wallet as NodeWallet;
    payer = wallet.payer as anchor.web3.Keypair;

    msolMint = new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So");
    console.log("msolMint:", msolMint.toBase58());

    // Create user mSOL token account
    userMsolAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      msolMint,
      payer.publicKey
    )).address;
    console.log("User mSOL Account: ", userMsolAccount.toBase58());

    // Derive PDA for protocol_sol_account
    [protocolSolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("protocol_sol_account")],
      program.programId
    );
    console.log("Protocol SOL Account: ", protocolSolAccount.toBase58());
    // Create protocol mSOL token account (owned by protocol PDA)
    protocolMsolAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      msolMint,
      program.programId, // let program own this
      true
    )).address;
    console.log("Protocol mSOL Account: ", protocolMsolAccount.toBase58());
    //topping up protocolSolAccount
    const topUpAmount = 1_000_000;
    const tx2 = new anchor.web3.Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: protocolSolAccount,
        lamports: topUpAmount,
      })
    );
    await provider.sendAndConfirm(tx2, [payer]);

    //NEW
    TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");



    // const tokenResponse = await createTokenWithMetadata(provider, payer, "FAKE_GRASS_TOKEN", "FGT", "https://arweave.net/Xjqaj_rYYQGrsiTk9JRqpguA813w6NGPikcRyA1vAHM", Number(3_000_000_000_000_000));
    // grassMint = tokenResponse.tokenMint;

    grassMint = new PublicKey("tVRuMWjtNDJt8yz89KTtdUEjZXMEo5NwoSvubjYq9zV");
    userTokenAccount = await getAssociatedTokenAddress(
      grassMint,
      payer.publicKey
    );
    userWSolAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      payer.publicKey
    );


    metadataAddress = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        grassMint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];

    [token0, token1] =
      grassMint.toBase58() < NATIVE_MINT.toBase58()
        ? [grassMint, NATIVE_MINT]
        : [NATIVE_MINT, grassMint];
    const raydiumIdl = JSON.parse(readFileSync('tests/idl/raydium_cp_swap.json', 'utf-8'));
    raydiumSwapProgramID = new PublicKey("CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW");
    const raydiumProgram = new Program(raydiumIdl, raydiumSwapProgramID, provider) as Program<RaydiumCpSwap>;
    createPoolFee = new PublicKey("G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2")
    ammConfig = new PublicKey("9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6")


    auth = await getAuthAddress(raydiumProgram.programId);
    poolState = await getPoolAddress(
      ammConfig,
      token0,
      token1,
      raydiumSwapProgramID
    );
    lpMintAddress = await getPoolLpMintAddress(
      poolState,
      raydiumProgram.programId
    );
    vault0 = await getPoolVaultAddress(
      poolState,
      token0,
      raydiumProgram.programId
    );
    vault1 = await getPoolVaultAddress(
      poolState,
      token1,
      raydiumProgram.programId
    );
    const [creatorLpTokenAddress] = await PublicKey.findProgramAddress(
      [
        payer.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        lpMintAddress.toBuffer(),
      ],
      ASSOCIATED_PROGRAM_ID
    );
    userLpTokenVault = creatorLpTokenAddress

    observationAddress = await getOracleAccountAddress(
      poolState,
      raydiumProgram.programId
    );
  });


  it("Marinade Deposit", async () => {
    let lamports = new anchor.BN(1_000_000);
    const tx = await program.methods.marinadeDeposit(lamports).accounts({
      state: new anchor.web3.PublicKey("8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC"),
      msolMint: msolMint,
      liqPoolSolLegPda: new anchor.web3.PublicKey('UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q'),
      liqPoolMsolLeg: new anchor.web3.PublicKey('7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE'),
      liqPoolMsolLegAuthority: new anchor.web3.PublicKey('EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL'),
      reservePda: new anchor.web3.PublicKey('Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN'),
      transferFrom: provider.wallet.publicKey,
      mintTo: userMsolAccount,
      mintAuthority: new anchor.web3.PublicKey('3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM'),
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      marinadeProgram: new anchor.web3.PublicKey('MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'),
    }).signers([payer]).rpc({ skipPreflight: true });
    await program.provider.connection.confirmTransaction(tx, 'finalized');
    console.log("Marinade Deposit Tx: ", tx);
  });

  it("Creating Token and Initializing Pool over Raydium", async () => {
    LAMPORTS_THRESHOLD = 10_000_000_000;

    const token0Obj = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      token0,
      payer.publicKey,
      false,
    );
    userToken0Account = token0Obj.address

    const token1Obj = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      token1,
      payer.publicKey,
      false,
    );

    userToken1Account = token1Obj.address;
    const userWSolAccountObj = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      NATIVE_MINT,
      payer.publicKey,
      false,
    );
    userWSolAccount = userWSolAccountObj.address;

    try {
      // Fetch the user's WSOL balance
      const accountInfo = await getAccount(provider.connection, userWSolAccount);
      const currentBalance = Number(accountInfo.amount);

      console.log(`Current WSOL Balance: ${currentBalance} lamports`);

      if (currentBalance < LAMPORTS_THRESHOLD) {
        console.log("WSOL balance is low, wrapping SOL...");

        const tx = new Transaction();

        // Transfer SOL to the WSOL ATA
        tx.add(
          SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: userWSolAccount,
            lamports: LAMPORTS_THRESHOLD,
          })
        );

        tx.add(createSyncNativeInstruction(userWSolAccount));

        await sendAndConfirmTransaction(provider.connection, tx, [payer]);

      } else {
        console.log("WSOL balance is sufficient, no need to wrap.");
      }
    } catch (error) {
      console.error("Error checking WSOL balance:", error);
    }



    console.log(" ACCOUNTS w.r.t Grass & SOL", {
      token0: token0.toBase58(),
      token1: token1.toBase58(),
      userToken0Account: userToken0Account.toBase58(),
      userToken1Account: userToken1Account.toBase58(),
      token0Vault: vault0.toBase58(),
      token1Vault: vault1.toBase58(),
      cpSwapProgram: raydiumSwapProgramID.toBase58(),
      ammConfig: ammConfig.toBase58(),
      poolState: poolState.toBase58(),
      authority: auth.toBase58(),
      lpMint: lpMintAddress.toBase58(),
      userLpTokenVault: userLpTokenVault.toBase58(),
      createPoolFee: createPoolFee.toBase58(),
    })
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 500_000
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 5_000
    });
    //TODO: Make Grass 2M and WSol 25 below
    let LiqGrassAmount = new anchor.BN(2_000_000_000_000_000);
    let LiqWSolAmount = new anchor.BN(10_000_000_000);

    const tx = await program.methods.createPool(LiqGrassAmount, LiqWSolAmount)
      .preInstructions([modifyComputeUnits, addPriorityFee])
      .accounts({
        metadata: metadataAddress,
        tokenDetails: tokenVault,
        vaultTokenAccount: vaultTokenAccount,
        token0Mint: token0,
        token1Mint: token1,
        payer: payer.publicKey,
        userToken0Account: userToken0Account,
        userToken1Account: userToken1Account,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        cpSwapProgram: raydiumSwapProgramID,
        ammConfig: ammConfig,
        poolState: poolState,
        authority: auth,
        lpMint: lpMintAddress,
        userLpTokenVault: userLpTokenVault,
        token0Vault: vault0,
        token1Vault: vault1,
        createPoolFee: createPoolFee,
        observationState: observationAddress,
      }).signers([payer]).rpc({ skipPreflight: true });

    await program.provider.connection.confirmTransaction(tx, "finalized");
    console.log("Transaction Signature:", tx);


  });


  it("it should swap Grass for Sol", async () => {
    //TODO: Increase swap amount if liquidity is increased above and avoid slippage too 
    const amountGrassIn = new anchor.BN(1000); // 0.0000001 Grass
    const amountWSolOut = new anchor.BN(900);//0.00000009 WSol

    const tx = await program.methods.swapGrassForSol(amountGrassIn, amountWSolOut, grassMint)
      .accounts({
        payer: payer.publicKey,
        authority: auth,
        ammConfig: ammConfig,
        poolState: poolState,
        token0Account: userToken0Account,
        token1Account: userToken1Account,
        token0Mint: token0,
        token1Mint: token1,
        observationState: observationAddress,
        poolVaultToken0: vault0,
        poolVaultToken1: vault1,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        raydiumSwapProgram: raydiumSwapProgramID,
      })
      .signers([payer])
      .rpc({
        skipPreflight: true
      });
    await program.provider.connection.confirmTransaction(tx, "finalized");
    console.log("Swap Tx:", tx);
  })

  it("Liquid Unstake", async () => {
    const msolAmountToUnstake = new anchor.BN(900_000);

    const tx = await program.methods.liquidUnstake(msolAmountToUnstake)
      .accounts({
        state: new anchor.web3.PublicKey("8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC"),
        msolMint: msolMint,
        liqPoolSolLegPda: new anchor.web3.PublicKey('UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q'),
        liqPoolMsolLeg: new anchor.web3.PublicKey('7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE'),
        treasuryMsolAccount: new anchor.web3.PublicKey('8ZUcztoAEhpAeC2ixWewJKQJsSUGYSGPVAjkhDJYf5Gd'),
        getMsolFrom: userMsolAccount,
        getMsolFromAuthority: provider.wallet.publicKey,
        transferSolTo: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        marinadeProgram: new anchor.web3.PublicKey('MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'),
      }).signers([payer]).rpc({ skipPreflight: true });
    await program.provider.connection.confirmTransaction(tx, 'finalized');
    console.log(" Liquid Unstake Tx: ", tx);
  });

  it("Full Scenario Test: Deposit Withdraw", async () => {

    const token0Obj = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      token0,
      payer.publicKey,
      false,
    );
    userToken0Account = token0Obj.address

    const token1Obj = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      token1,
      payer.publicKey,
      false,
    );
    userToken1Account = token1Obj.address

    const amountGrassIn = new anchor.BN(8000 * 10 ** 9); // 8000 Grass
    const amountWSolOut = new anchor.BN(900);//0.00000009 WSol

    // sol balance before swap
    const solBalanceBeforeSwap = await provider.connection.getBalance(payer.publicKey);
    console.log("SOL Balance before swap:", solBalanceBeforeSwap);

    const tx = await program.methods.swapGrassForSol(amountGrassIn, amountWSolOut, grassMint)
      .accounts({
        payer: payer.publicKey,
        authority: auth,
        ammConfig: ammConfig,
        poolState: poolState,
        token0Account: userToken0Account,
        token1Account: userToken1Account,
        token0Mint: token0,
        token1Mint: token1,
        observationState: observationAddress,
        poolVaultToken0: vault0,
        poolVaultToken1: vault1,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        raydiumSwapProgram: raydiumSwapProgramID,
      })
      .signers([payer])
      .rpc({
        skipPreflight: true
      });
    await program.provider.connection.confirmTransaction(tx, "finalized");
    console.log("Swap Tx:", tx);

    //  sol balance after swap
    const solBalanceAfterSwap = await provider.connection.getBalance(payer.publicKey);
    console.log("SOL Balance after swap:", solBalanceAfterSwap);

    // check sol balance difference
    const solBalanceDifference = new anchor.BN(solBalanceAfterSwap).sub(new anchor.BN(solBalanceBeforeSwap));
    console.log("SOL Balance difference:", solBalanceDifference);

    let lamports = new anchor.BN(solBalanceDifference);
    const tx1 = await program.methods.marinadeDeposit(lamports).accounts({
      state: new anchor.web3.PublicKey("8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC"),
      msolMint: msolMint,
      liqPoolSolLegPda: new anchor.web3.PublicKey('UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q'),
      liqPoolMsolLeg: new anchor.web3.PublicKey('7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE'),
      liqPoolMsolLegAuthority: new anchor.web3.PublicKey('EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL'),
      reservePda: new anchor.web3.PublicKey('Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN'),
      transferFrom: provider.wallet.publicKey,
      mintTo: userMsolAccount,
      mintAuthority: new anchor.web3.PublicKey('3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM'),
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      marinadeProgram: new anchor.web3.PublicKey('MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'),
    }).signers([payer]).rpc({ skipPreflight: true });
    await program.provider.connection.confirmTransaction(tx1, 'finalized');
    console.log("Marinade Deposit Tx:", tx1);

    // check spl msol balance
    const msolBalance = await provider.connection.getTokenAccountBalance(userMsolAccount);
    console.log("MSOL Token Balance:", msolBalance.value.uiAmount);

    const msolAmountToUnstake = new anchor.BN(msolBalance.value.amount);

    const tx2 = await program.methods.liquidUnstake(msolAmountToUnstake)
      .accounts({
        state: new anchor.web3.PublicKey("8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC"),
        msolMint: msolMint,
        liqPoolSolLegPda: new anchor.web3.PublicKey('UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q'),
        liqPoolMsolLeg: new anchor.web3.PublicKey('7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE'),
        treasuryMsolAccount: new anchor.web3.PublicKey('8ZUcztoAEhpAeC2ixWewJKQJsSUGYSGPVAjkhDJYf5Gd'),
        getMsolFrom: userMsolAccount,
        getMsolFromAuthority: provider.wallet.publicKey,
        transferSolTo: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        marinadeProgram: new anchor.web3.PublicKey('MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'),
      }).signers([payer]).rpc({ skipPreflight: true });
    await program.provider.connection.confirmTransaction(tx2, 'finalized');
    console.log(" Liquid Unstake Tx: ", tx2);


  })

});




