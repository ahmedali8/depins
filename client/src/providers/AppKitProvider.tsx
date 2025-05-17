import type { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";
import WalletProvider from "./WalletProvider";
import ReactQueryProvider from "./ReactQueryProvider";

export default function AppKitProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <WalletProvider>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ReactQueryProvider>
    </WalletProvider>
  );
}
