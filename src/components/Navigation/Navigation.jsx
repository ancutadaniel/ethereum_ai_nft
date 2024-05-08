import { ethers } from "ethers";
import { useState } from "react";

import classes from "./Navigation.module.css";

const Navigation = () => {
  const [account, setAccount] = useState(""); // [1]
  const connectHandler = async () => {
    // Check if Ethereum object is available in window to handle cases where MetaMask is not installed
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const normalizedAccount = ethers.utils.getAddress(accounts[0]);
        setAccount(normalizedAccount);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to connect.");
    }
  };

  // Function to format the account address
  const getFormattedAddress = (account) => {
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  return (
    <nav>
      <div className={classes['nav__brand']}>
        <h1>AI NFT Generator</h1>
      </div>

      {account ? (
        <button
          type="button"
          className={classes['nav__connect']}
          onClick={connectHandler}
          title="Click to reconnect"
        >
          {getFormattedAddress(account)}
        </button>
      ) : (
        <button
          type="button"
          className={classes['nav__connect']}
          onClick={connectHandler}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Navigation;
