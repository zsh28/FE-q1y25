// src/components/SendTransactionOnConnect.tsx
"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram } from "@solana/web3.js";

export function SendTransactionOnConnect() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [txSent, setTxSent] = useState(false);

  useEffect(() => {
    // Only send the transaction if the wallet is connected and we haven't already sent it.
    if (connected && publicKey && !txSent) {
      const sendTx = async () => {
        // Create a transaction that transfers 1 lamport from the wallet to itself.
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey, // Self-transfer: this is just for testing purposes.
            lamports: 1, // Amount to transfer (in lamports)
          })
        );

        try {
          // Send the transaction using the wallet adapter
          const signature = await sendTransaction(transaction, connection);
          console.log("Transaction sent with signature:", signature);

          // Optionally, wait for transaction confirmation
          await connection.confirmTransaction(signature, "confirmed");
          console.log("Transaction confirmed");
          setTxSent(true);
        } catch (error) {
          console.error("Error sending transaction:", error);
        }
      };

      sendTx();
    }
  }, [connected, publicKey, txSent, sendTransaction, connection]);

  return null; // This component does not render any UI.
}
