import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  trustWallet,
  phantomWallet,
} from "@thirdweb-dev/react";import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Head from 'next/head';
import {NextUIProvider} from '@nextui-org/react'
import "../styles/fonts.css"; 

const activeChain = "binance-testnet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <title>Gave Apps beta</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <ThirdwebProvider
    activeChain={activeChain}
    supportedWallets={[
      metamaskWallet(),
      coinbaseWallet(),
      walletConnect(),
      trustWallet(),
      phantomWallet(),
    ]}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
      <NextUIProvider>
      <Navbar />
      <Component {...pageProps} />
      </NextUIProvider>
    </ThirdwebProvider>
    </>
  );
}

export default MyApp;
