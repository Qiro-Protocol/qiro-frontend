import "@/styles/globals.css";
import type { AppProps } from "next/app";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Toaster } from "react-hot-toast";

const { chains, publicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: "Tv9MYE2mD4zn3ziBLd6S94HvLLjTocju" }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Qiro",
  projectId: "2c3dc1da5fc93b3e017c4d1fc81aa9c7",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Toaster />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
