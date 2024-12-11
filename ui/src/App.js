import { useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import Shield from "./Shield";
import "./App.css";

function App() {
  const [connection, setConnection] = useState();
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    alert("connecting");
    const response = await connect({
      modalMode: "alwaysAsk",
      modalTheme: "light",
      webWalletUrl: "https://web.argent.xyz",
      argentMobileOptions: {
        dappName: "Hackathon SPQR",
        projectId: "3a80b8d6b01bb78fc36abe41c78fbada", // wallet connect project id
        chainId: "SN_MAIN",
        url: window.location.hostname,
        icons: ["https://your-icon-url.com"],
        rpcUrl: "https://starknet-mainnet.public.blastapi.io",
      },
    });

    if (response) {
      alert("response");
    }

    if (response.wallet) {
      alert("wallet");
    }

    if (response.connectorData) {
      alert("connectorData");
    }

    if (response.wallet && response.connectorData) {
      setConnection(response.wallet);
      setAddress(response.connectorData.account);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setConnection(undefined);
    setAddress("");
  };

  const fmtAddress = (address) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <div className="App">
      <div className="navigation">
        <div className="logo">SPQR</div>
        <div className="menu">
          {!connection ? (
            <button className="wallet-btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div>
              <button className="wallet-btn" onClick={disconnectWallet}>
                Disconnect (Address: {fmtAddress(address)})
              </button>
            </div>
          )}
        </div>
      </div>
      <Shield />
    </div>
  );
}

export default App;
