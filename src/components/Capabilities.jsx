import React from "react";

const capabilityGroups = [
  {
    title: "Before Call",
    items: [
      "Dispatch brief analyzer (highlights risks, protocols, checklists)",
      "Equipment reminder engine (kits, meds, readiness checks)"
    ]
  },
  {
    title: "During Call",
    items: [
      "Live field capture (hands-free vitals and actions logging)",
      "Real-time red flag alerts (high-acuity pattern detection)",
      "Scene safety monitor (prompts for hazards and documentation)",
      "Adaptive pediatric mode (weight-based guidance + guardrails)"
    ]
  },
  {
    title: "After Call",
    items: [
      "Instant handoff summary (SBAR style)",
      "Documentation completeness checks"
    ]
  },
  {
    title: "Between Calls",
    items: [
      "Quick admin assistant (occurrence reports, equipment issues)",
      "Weather and road intelligence",
      "Shift fatigue tracker prompts"
    ]
  },
  {
    title: "End of Shift",
    items: [
      "Shift summary generator (calls, acuity, pending tasks)",
      "Compliance risk scanner (certifications, ACRs, overtime)"
    ]
  },
  {
    title: "Decision Support",
    items: [
      "Micro-decision guidance (protocol-based dosing with safety)",
      "Smart destination advisor (trauma/stroke/peds routing)",
      "Legal protection layer (timestamps, edit history)"
    ]
  }
];

export default function Capabilities() {
  return (
    <div className="card" style={{ marginTop: "16px" }}>
      <h3>What ParaHelper Can Do</h3>
      <div style={{ display: "grid", gap: "12px" }}>
        {capabilityGroups.map((group) => (
          <div key={group.title}>
            <strong>{group.title}</strong>
            <ul style={{ margin: "6px 0 0 16px" }}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
