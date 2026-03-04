import React, { useState } from "react";
import { login } from "../routes/auth.js";
import fireflyVideo from "../assets/Firefly 644697.mp4";
import "./Login.css";

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
    <div className="login-page">
      <video
        className="login-video"
        src={fireflyVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="login-overlay" aria-hidden />
      <div className="login-content">
        <h1 className="login-title">Welcome I am ParaHelper</h1>
        <p className="login-subtitle">Please insert paramedic ID to access.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            id="paramedic-id"
            name="paramedic_id"
            type="text"
            placeholder="Paramedic ID (e.g., P-001)"
            value={paramedicId}
            onChange={(e) => setParamedicId(e.target.value)}
            autoComplete="off"
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" type="submit">
            Start Shift
          </button>
        </form>
      </div>
    </div>
  );
}
