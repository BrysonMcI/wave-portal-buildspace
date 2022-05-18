import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

export default function App() {
  const contractAddress = "0xb90FE557cec0d111B7a4b86f423Ae691A0a645a1";
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState(0);
  const [hasWaved, setHasWaved] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("No Metamask Detected!");
        return;
      } else {
        console.log(ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(account);
        setCurrentAccount(account);
      } else {
        console.log("No account authorized");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("No wallet detected!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Wave Count:", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Wave Count:", count.toNumber());
        setWaveCount(count.toNumber());
        setHasWaved(true);
      } else {
        console.log("Connect your wallet first!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="Hand wave">
            👋
          </span>{" "}
          Hey there!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave Back
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {hasWaved && <span>{waveCount} people have waved back!</span>}
      </div>
    </div>
  );
}
