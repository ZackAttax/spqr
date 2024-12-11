import { useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import "./Shield.css";
import ethereum from "./ethereum.png";

function Shield() {
  const [strkBalance, setStrkBalance] = useState(0);
  const [strkShieldedBalance, setStrkShieldedBalance] = useState(0);

  const handleShield = () => {
    setStrkShieldedBalance(strkShieldedBalance + 1);
    setStrkBalance(strkBalance - 1);
  };

  const handleUnshield = () => {
    setStrkShieldedBalance(strkShieldedBalance - 1);
    setStrkBalance(strkBalance + 1);
  };

  return (
    <div className="Shield">
      <div className="group">{/* <img src={ethereum} alt="ethereum" /> */}</div>
      <div>
        <div className="balance">
          <div className="label">Public</div>
          <div>{strkBalance} STRK</div>
          <br />
          <button onClick={handleShield}>Shield</button>
        </div>
        <div className="balance balance-private">
          <div className="label label-private">Private</div>
          <div>{strkShieldedBalance} STRK</div>
          <br />
          <button onClick={handleUnshield}>Unshield</button>
          <button onClick={handleUnshield}>Transfer</button>
        </div>
      </div>
    </div>
  );
}

export default Shield;
