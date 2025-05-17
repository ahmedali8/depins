import "@/styles/index.css";
import { StrictMode } from "react";
import { AppKitProvider } from "@/providers";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleSignInButton } from "@/components/molecules";
import { Dashboard, DePins, Download, Landing } from "@/components/pages";
import {
  WalletDisconnectButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";
import EarningsDashboard from "./components/pages/Dashboard2";

function App() {
  const { connected, connecting, publicKey } = useWallet();

  const renderWalletButton = () => {
    if (connecting) {
      return <WalletModalButton>Connecting...</WalletModalButton>;
    }

    if (connected && publicKey) {
      const shortKey = `${publicKey.toBase58().slice(0, 5)}..${publicKey
        .toBase58()
        .slice(-5)}`;

      return <WalletDisconnectButton>{shortKey}</WalletDisconnectButton>;
    }

    return <WalletModalButton>Connect Wallet</WalletModalButton>;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/depins" element={<DePins />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </main>
  );
}

/**
 * The main entry point of the application.
 *
 * - Imports global styles and necessary dependencies.
 * - Wraps the application with `GoogleOAuthProvider` for Google OAuth functionality.
 * - Renders the `App` component inside a `StrictMode` wrapper.
 *
 * @remarks
 * Ensure that the `VITE_GOOGLE_OAUTH_CLIENT_ID` environment variable is properly set
 * for the Google OAuth integration to work.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <AppKitProvider>
          <App />
        </AppKitProvider>
      </GoogleOAuthProvider>
    </Router>
  </StrictMode>
);
