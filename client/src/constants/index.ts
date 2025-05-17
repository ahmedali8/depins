import { clusterApiUrl, Connection } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

/** Network */
export const NETWORK = WalletAdapterNetwork.Devnet;

/** Connection */
export const CONNECTION = new Connection(clusterApiUrl(NETWORK), "confirmed");

export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
