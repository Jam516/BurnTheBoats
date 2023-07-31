import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ConnectKitButton } from "connectkit";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  usePrepareSendTransaction,
} from "wagmi";
import { useState, useEffect } from "react";
import { parseEther } from "viem";

export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

function MainBlock() {
  return (
    <main className={styles.main}>
      <ConnectBlock />
      <TitleBlock />
      <BridgeBlock />
      <WarningBlock />
    </main>
  );
}

function ConnectBlock() {
  return (
    <div className={styles.connectDiv}>
      <ConnectKitButton />
    </div>
  );
}

function TitleBlock() {
  return (
    <div className={styles.titleDiv}>
      <h1 className={styles.title}>Burn the Boats</h1>
      <p className={styles.description}>One-way ticket to Base 🔵✨</p>
    </div>
  );
}

function WarningBlock() {
  return (
    <div className={styles.titleDiv}>
      <ul>
        <li>This app is NOT TESTED and exists FOR DEMONSTRATION PURPOSES ONLY!! ⚠️</li>
        <li>You can only use this app to bridge to Base. YOU CANT BRIDGE BACK!!!⚠️⚠️</li>
        <li>It will take 5 minutes+ for funds to arrive on Base</li>
      </ul>
    </div>
  );
}

function BridgeBlock() {
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();

  const {
    data: userData,
    isError: userIsError,
    isLoading: userIsLoading,
  } = useBalance({
    address: address,
    watch: true,
  });

  const userBalance = parseFloat(userData?.formatted || "0")?.toFixed(4);

  if (!isMounted) return null;
  return (
    <div className={styles.tipDiv}>
      <BalanceBlock
        userIsConnected={isConnected}
        userBalance={userBalance}
        userIsError={userIsError}
        userIsLoading={userIsLoading}
      />
      <BridgeModal isConnected={isConnected} userBalance={userBalance} />
    </div>
  );
}

interface BalanceBlockProps {
  userIsConnected: boolean;
  userBalance: string;
  userIsError: boolean;
  userIsLoading: boolean;
}

function BalanceBlock({
  userIsConnected,
  userBalance,
  userIsError,
  userIsLoading,
}: BalanceBlockProps) {
  return (
    <div className={styles.balanceDiv}>
      <BalanceCard
        title={"Your Balance"}
        balance={userBalance}
        isConnected={userIsConnected}
        isError={userIsError}
        isLoading={userIsLoading}
      />
    </div>
  );
}

interface BalanceCardProps {
  title: string;
  balance: string;
  isConnected: boolean;
  isError: boolean;
  isLoading: boolean;
}

function BalanceCard({
  title,
  balance,
  isConnected,
  isError,
  isLoading,
}: BalanceCardProps) {
  return (
    <div className={styles.balanceCard}>
      <h2 className={styles.balanceHeader}>{title}</h2>
      <p>
        {!isConnected
          ? "0 ETH"
          : isLoading
          ? "Fetching balance…"
          : isError
          ? "Error fetching balance"
          : `${balance} ETH`}
      </p>
    </div>
  );
}

interface BridgeModalProps {
  isConnected: boolean;
  userBalance: string;
}

function BridgeModal({ isConnected, userBalance }: BridgeModalProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input value state when the input changes
    setInputValue(event.target.value);
  };

  const isNotNumber = isNaN(Number(inputValue));

  const { config } = usePrepareSendTransaction({
    to: "0x49048044d57e1c92a77f79988d21fa8faf74e97e",
    value: parseEther(inputValue),
  });
  const { data, isLoading, isSuccess, sendTransaction } =
    useSendTransaction(config);

  // useEffect(() => {
  //   if (isSuccess) {
  //     setInputValue("");
  //     window.alert("Transaction Pending ...");
  //   }
  // }, [isSuccess]);

  return (
    <div className={styles.hold}>
      <div className={styles.modal}>
        <h4 className={styles.modalHeader}> Enter amount in ETH </h4>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        ></input>
        <button
          onClick={() => sendTransaction?.()}
          className={styles.buttonmodal}
          disabled={
            !sendTransaction ||
            isLoading ||
            inputValue === "" ||
            isNotNumber ||
            !isConnected ||
            Number(inputValue) > Number(userBalance)
          }
        >
          Send to Base
        </button>
        {Number(inputValue) > Number(userBalance) && (
          <div>You dont have enough ETH...</div>
        )}
        {isLoading && <div>Check Wallet</div>}
      </div>
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>TipJar</title>
        <meta name="description" content="Burn the Boats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainBlock />
    </div>
  );
};

export default Home;
