import { useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import "./Shield.css";
import ethereum from "./ethereum.png";

function Shield() {
  const [strkBalance, setStrkBalance] = useState(0);
  const [strkShieldedBalance, setStrkShieldedBalance] = useState(0);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientPublicKey, setRecipientPublicKey] = useState("");

  const handleShield = () => {
    setStrkShieldedBalance(strkShieldedBalance + 1);
    setStrkBalance(strkBalance - 1);
  };

  const handleUnshield = () => {
    setStrkShieldedBalance(strkShieldedBalance - 1);
    setStrkBalance(strkBalance + 1);
  };

  const handleTransfer = () => {
    // TODO(michael): implement transfer.
    let address = "";
    let amount = "";

    setTransferAmount("");
    setRecipientPublicKey("");
    setIsTransferModalOpen(false);
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
          <button
            onClick={() => {
              setTimeout(() => {
                setRecipientPublicKey("0x3432478372489738947382784932");
              }, 10000);
              setIsTransferModalOpen(true);
            }}
          >
            Transfer
          </button>
        </div>
      </div>

      {isTransferModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Transfer STRK</h2>
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Recipient Public Key"
              value={recipientPublicKey}
            />
            <div className="modal-buttons">
              <button onClick={handleTransfer}>Confirm</button>
              <button
                onClick={() => {
                  setIsTransferModalOpen(false);
                  setRecipientPublicKey("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shield;
