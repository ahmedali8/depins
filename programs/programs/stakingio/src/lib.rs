pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use instructions::*;
pub use state::*;

declare_id!("3y1X6dP8NPLk2Wtsc7S6e29Sbw8quHufLJJReZGEUDs1");

#[program]
pub mod stakingio {
    use super::*;

    pub fn marinade_deposit(ctx: Context<MarinadeDeposit>, amount: u64) -> Result<()> {
        marinade_deposit::handler(ctx, amount)
    }

    pub fn liquid_unstake(
        ctx: Context<LiquidUnstake>,
        msol_amount: u64
    ) -> Result<()> {
        marinade_liquid_unstake::handler(ctx, msol_amount)
    }

    pub fn create_pool(
        ctx: Context<CreateTokenPool>,
        liq_grass_amount: u64,
        liq_sol_amount: u64
    ) -> Result<()> {
        create_pool::handler(ctx, liq_grass_amount, liq_sol_amount)
    }
    pub fn swap_grass_for_sol(
        ctx: Context<SwapForTai>,
        amount_in: u64,
        min_amount_out: u64,
        grass_mint: Pubkey
    ) -> Result<()> {
        swap_grass_for_sol::handler(ctx, amount_in, min_amount_out, grass_mint)
    }
}
