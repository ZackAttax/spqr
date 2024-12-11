import { useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import "./Shield.css";
import ethereum from "./ethereum.png";

function Shield() {
  return (
    <div className="Shield">
      <div className="group">
        <img src={ethereum} alt="ethereum" />
      </div>
      <h1>
        How many tokens would you like to transfer?
        <h4>Please insert an amount.</h4>
      </h1>
    </div>
  );
}

export default Shield;
