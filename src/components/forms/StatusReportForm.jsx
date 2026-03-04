import React, { useState } from "react";
import { sendForms } from "../../routes/forms.js";
import { toField } from "./formHelpers.js";

export default function StatusReportForm({ paramedic, onSystemMessage }) {
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    setStatus("");
    const extracted = {
      status_report: {
        request: toField("status report request")
      }
    };
    await sendForms({ paramedic_id: paramedic.paramedic_id, extracted });
    setStatus("Status Report sent.");
    onSystemMessage?.("Status Report sent to you and your supervisor.");
  };

  return (
    <div>
      <h3>Paramedic Status Report</h3>
      <p>
        This will generate the compliance checklist and email it to you and your supervisor.
      </p>
      <button className="btn" onClick={handleSend} type="button">
        Send Status Report
      </button>
      {status && <span style={{ marginLeft: "12px", color: "#22c55e" }}>{status}</span>}
    </div>
  );
}
