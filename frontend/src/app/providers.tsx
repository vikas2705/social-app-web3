"use client";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "viem";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = "YOUR_PROJECT_ID"; // Get from WalletConnect Cloud

const { connectors } = getDefaultWallets({
  appName: "Decentralized Social Media",
  projectId,
});

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});

const queryClient = new QueryClient();

// Create a client-side only version of the providers
const Providers = dynamic(
  () =>
    Promise.resolve(({ children }: { children: React.ReactNode }) => (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    )),
  { ssr: false }
);

export { Providers };
