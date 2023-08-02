import "../styles/global.css";
import type { AppProps } from "next/app";
import { mainnet } from "wagmi/chains";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Analytics } from '@vercel/analytics/react';

const alchemyId = process.env.ALCHEMY_API_KEY;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;

const chains = [mainnet];

const config = createConfig(
  getDefaultConfig({
    alchemyId,
    walletConnectProjectId: walletConnectProjectId || "default",
    chains,
    appName: "TipJar",
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <Component {...pageProps} />
        <Analytics />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
