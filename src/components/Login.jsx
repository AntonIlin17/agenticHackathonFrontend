import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export default function Login({ onLogin }) {
  const [badge, setBadge] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        badge_number: badge,
        pin
      });
      onLogin(res.data.paramedic, res.data.briefing);
    } catch (err) {
      setError("Login failed. Check badge or PIN.");
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
