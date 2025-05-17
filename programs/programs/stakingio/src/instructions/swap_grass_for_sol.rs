use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::{self},
    token::{self, Mint, Token, TokenAccount},
};
use raydium_cp_swap::{
    cpi::{accounts::Swap, swap_base_input},
    program::RaydiumCpSwap,
    states::{AmmConfig, ObservationState, PoolState},
};
use spl_token::native_mint::ID as NATIVE_MINT;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct SwapForTai<'info> {

    #[account(mut)]
    pub payer: Signer<'info>,

    ///CHECK: UncheckedAccount (Authority for Raydium Swap)
    #[account(mut)]
    pub authority: UncheckedAccount<'info>,

    #[account(
        mut,
        associated_token::mint = token0_mint,
        associated_token::authority = payer
    )]
    pub token0_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token1_mint,
        associated_token::authority = payer
    )]
    pub token1_account: Account<'info, TokenAccount>,

    #[account(mut, address = pool_state.load()?.token_0_mint)]
    pub token0_mint: Account<'info, Mint>,

    #[account(mut,address = pool_state.load()?.token_1_mint)]
    pub token1_mint: Account<'info, Mint>,

    #[account(address = pool_state.load()?.amm_config)]
    pub amm_config: Box<Account<'info, AmmConfig>>,

    #[account(mut, address = pool_state.load()?.observation_key)]
    pub observation_state: AccountLoader<'info, ObservationState>,

    #[account(mut, address = pool_state.load()?.token_0_vault)]
    pub pool_vault_token0: Account<'info, TokenAccount>,

    #[account(mut, address = pool_state.load()?.token_1_vault)]
    pub pool_vault_token1: Account<'info, TokenAccount>,

    #[account(mut)]
    pub pool_state: AccountLoader<'info, PoolState>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub raydium_swap_program: Program<'info, RaydiumCpSwap>,
}



pub fn handler(
    mut ctx: Context<SwapForTai>,
    amount_in: u64,
    min_amount_out: u64,
    grass_mint: Pubkey,
) -> Result<()> {
    let accounts = &mut ctx.accounts;

    let (input_account, output_account, input_vault, output_vault, input_mint, output_mint) =
        if accounts.token0_mint.key() == grass_mint && accounts.token1_mint.key() == NATIVE_MINT {
            (
                &accounts.token0_account,
                &accounts.token1_account,
                &accounts.pool_vault_token0,
                &accounts.pool_vault_token1,
                &accounts.token0_mint,
                &accounts.token1_mint,
            )
        } else if accounts.token1_mint.key() == grass_mint && accounts.token0_mint.key() == NATIVE_MINT {
            (
                &accounts.token1_account,
                &accounts.token0_account,
                &accounts.pool_vault_token1,
                &accounts.pool_vault_token0,
                &accounts.token1_mint,
                &accounts.token0_mint,
            )
        } else {
            return Err(error!(ErrorCode::InvalidSwapDirection)); 
        };

    msg!("Swapping Grass → wSOL");

    // Approve Raydium swap program to spend user's Grass
    let approve_ctx = CpiContext::new(
        accounts.token_program.to_account_info(),
        token::Approve {
            to: input_account.to_account_info(),
            delegate: accounts.raydium_swap_program.to_account_info(),
            authority: accounts.payer.to_account_info(),
        },
    );
    token::approve(approve_ctx, amount_in)?;

    // Perform the swap
    let swap_ctx = CpiContext::new(
        accounts.raydium_swap_program.to_account_info(),
        Swap {
            payer: accounts.payer.to_account_info(),
            authority: accounts.authority.to_account_info(),
            amm_config: accounts.amm_config.to_account_info(),
            pool_state: accounts.pool_state.to_account_info(),
            input_token_account: input_account.to_account_info(),
            output_token_account: output_account.to_account_info(),
            input_vault: input_vault.to_account_info(),
            output_vault: output_vault.to_account_info(),
            input_token_program: accounts.token_program.to_account_info(),
            output_token_program: accounts.token_program.to_account_info(),
            input_token_mint: input_mint.to_account_info(),
            output_token_mint: output_mint.to_account_info(),
            observation_state: accounts.observation_state.to_account_info(),
        },
    );

    swap_base_input(swap_ctx, amount_in, min_amount_out)?;

    msg!(
        "Swapped {} Grass for min {} wSOL ({} → {})",
        amount_in,
        min_amount_out,
        input_mint.key(),
        output_mint.key()
    );

    Ok(())
}
