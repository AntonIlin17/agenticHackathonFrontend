import React, { useState } from "react";
import OccurrenceForm from "./OccurrenceForm.jsx";
import TeddyBearForm from "./TeddyBearForm.jsx";
import StatusReportForm from "./StatusReportForm.jsx";
import ShiftReportForm from "./ShiftReportForm.jsx";

const tabs = [
  { key: "occurrence", label: "Occurrence Report" },
  { key: "teddy", label: "Teddy Bear Form" },
  { key: "status", label: "Status Report" },
  { key: "shift", label: "Shift Report" }
];

export default function FormsHub({ paramedic, onSystemMessage }) {
  const [active, setActive] = useState("occurrence");

  return (
    <div className="card">
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`btn ${active === tab.key ? "" : "secondary"}`}
            onClick={() => setActive(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "occurrence" && (
        <OccurrenceForm paramedic={paramedic} onSystemMessage={onSystemMessage} />
      )}
      {active === "teddy" && (
        <TeddyBearForm paramedic={paramedic} onSystemMessage={onSystemMessage} />
      )}
      {active === "status" && (
        <StatusReportForm paramedic={paramedic} onSystemMessage={onSystemMessage} />
      )}
      {active === "shift" && (
        <ShiftReportForm paramedic={paramedic} onSystemMessage={onSystemMessage} />
      )}
    </div>
  );
}
