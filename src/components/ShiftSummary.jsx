import React from "react";

export default function ShiftSummary({ paramedic, onRestart }) {
  return (
    <div className="app-shell" style={{ alignItems: "center", padding: "24px" }}>
      <div className="card" style={{ maxWidth: "520px" }}>
        <h2>Shift Summary</h2>
        <p>Good shift today {paramedic.first_name}. All calls and forms are logged.</p>
        <ul>
          <li>Forms filed: 4</li>
          <li>Compliance alerts: 1</li>
          <li>Shift complete confirmation: sent</li>
        </ul>
        <button className="btn" onClick={onRestart}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
