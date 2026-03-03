import React from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function fieldColor(confidence) {
  if (confidence === "high") return "#22c55e";
  if (confidence === "medium") return "#facc15";
  return "#f87171";
}

export default function FormPanel({ paramedicId, extracted, guardrails, onSent }) {
  const hasForms = extracted && Object.keys(extracted).length > 0;
  const allClear =
    guardrails && Object.values(guardrails).every((result) => result.ok === true);

  const handleSend = async () => {
    await axios.post(`${API_URL}/api/forms/send`, {
      paramedic_id: paramedicId,
      extracted
    });
    onSent();
  };

  return (
    <div className="card">
      <h3>Live Form Filling</h3>
      {!hasForms && <p>No active forms yet.</p>}
      {hasForms &&
        Object.entries(extracted).map(([formKey, fields]) => (
          <div key={formKey} style={{ marginBottom: "16px" }}>
            <strong>{formKey.replace("_", " ")}</strong>
            {Object.entries(fields).map(([field, info]) => (
              <div key={field} style={{ marginTop: "6px" }}>
                <span style={{ color: fieldColor(info.confidence) }}>●</span>{" "}
                {field}: {info.value || "—"}
              </div>
            ))}
            {guardrails?.[formKey] && (
              <div style={{ fontSize: "12px", marginTop: "6px" }}>
                {guardrails[formKey].ok
                  ? "Guardrails OK"
                  : `Missing: ${guardrails[formKey].missing.join(", ")}`}
              </div>
            )}
          </div>
        ))}
      {hasForms && allClear && (
        <button className="btn" onClick={handleSend}>
          Send Forms
        </button>
      )}
      {hasForms && !allClear && (
        <button className="btn secondary" disabled>
          Awaiting missing fields
        </button>
      )}
    </div>
  );
}
