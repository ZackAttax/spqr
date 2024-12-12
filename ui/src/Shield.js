import { useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import "./Shield.css";
import ethereum from "./ethereum.png";

function Shield() {
  const [strkBalance, setStrkBalance] = useState(19.234);
  const [strkShieldedBalance, setStrkShieldedBalance] = useState(42);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientPublicKey, setRecipientPublicKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShieldModalOpen, setIsShieldModalOpen] = useState(false);
  const [shieldAmount, setShieldAmount] = useState("");

  const handleShield = () => {
    setIsLoading(true);
    document.body.style.pointerEvents = "none";

    setTimeout(() => {
      setStrkShieldedBalance(strkShieldedBalance + Number(shieldAmount));
      setStrkBalance(strkBalance - Number(shieldAmount));
      setShieldAmount("");
      setIsShieldModalOpen(false);
      setIsLoading(false);
      document.body.style.pointerEvents = "auto";
    }, 8000);
  };

  const handleUnshield = () => {
    setStrkShieldedBalance(strkShieldedBalance + 1);
  };

  const handleTransfer = () => {
    setIsLoading(true);
    document.body.style.pointerEvents = "none";

    setTimeout(() => {
      setStrkShieldedBalance(strkShieldedBalance - 21);
      setTransferAmount("");
      setRecipientPublicKey("");
      setIsTransferModalOpen(false);
      setIsLoading(false);
      document.body.style.pointerEvents = "auto";
    }, 3000);
  };

  return (
    <div className="Shield">
      <div className="group">{/* <img src={ethereum} alt="ethereum" /> */}</div>
      <div>
        <div className="balance">
          <div className="label">Public</div>
          <div>{strkBalance} STRK</div>
          <br />
          <button onClick={() => setIsShieldModalOpen(true)}>Shield</button>
        </div>
        <div className="balance balance-private">
          <div className="label label-private">Private</div>
          <div>{strkShieldedBalance} STRK</div>
          <br />
          <button onClick={handleUnshield}>Unshield</button>
          <button
            onClick={() => {
              setTimeout(() => {
                setRecipientPublicKey(
                  "0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1"
                );
              }, 8000);
              setIsTransferModalOpen(true);
            }}
          >
            Transfer
          </button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <button
        className="invisibile"
        onClick={() => {
          setTimeout(() => {
            setStrkShieldedBalance(strkShieldedBalance + 21);
          }, 2000);
        }}
      ></button>

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

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {isShieldModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Shield STRK</h2>
            <input
              type="number"
              placeholder="Amount"
              value={shieldAmount}
              onChange={(e) => setShieldAmount(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleShield}>Confirm</button>
              <button
                onClick={() => {
                  setIsShieldModalOpen(false);
                  setShieldAmount("");
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
