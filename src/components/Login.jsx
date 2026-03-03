import React, { useState } from "react";
import { login } from "../routes/auth.js";

export default function Login({ onLogin }) {
  const [badge, setBadge] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await login({ badge_number: badge, pin });
      onLogin(data.paramedic, data.briefing);
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed. Check badge or PIN.";
      setError(message);
    }
  };

  return (
    <div className="app-shell" style={{ alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: "360px" }}>
        <h2>ParaHelper</h2>
        <p>Paramedic login</p>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Badge Number"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          />
          <input
            className="input"
            placeholder="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          {error && <div style={{ color: "#f87171", marginBottom: "8px" }}>{error}</div>}
          <button className="btn" type="submit">
            Start Shift
          </button>
        </form>
      </div>
    </div>
  );
}
