import React, { useState } from "react";
import { login } from "../routes/auth.js";
import Capabilities from "./Capabilities.jsx";

export default function Login({ onLogin }) {
  const [paramedicId, setParamedicId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await login({
        paramedic_id: paramedicId.trim()
      });
      onLogin(data.paramedic, data.briefing);
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed. Check paramedic ID.";
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
            id="paramedic-id"
            name="paramedic_id"
            placeholder="Paramedic ID (e.g., P-001)"
            value={paramedicId}
            onChange={(e) => setParamedicId(e.target.value)}
          />
          {error && <div style={{ color: "#f87171", marginBottom: "8px" }}>{error}</div>}
          <button className="btn" type="submit">
            Start Shift
          </button>
        </form>
      </div>
      <div style={{ width: "480px", marginLeft: "24px" }}>
        <Capabilities />
      </div>
    </div>
  );
}
