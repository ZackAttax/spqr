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

  return (
    <div className="App">
      {!connection ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Address: {address}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}
    </div>
  );
}

export default App;
