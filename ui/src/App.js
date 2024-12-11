import { useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import "./App.css";

function App() {
  const [connection, setConnection] = useState();
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    const { wallet, connectorData } = await connect({});

    if (wallet && connectorData) {
      setConnection(wallet);
      setAddress(connectorData.account);
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
    </div>
  );
}

export default App;
