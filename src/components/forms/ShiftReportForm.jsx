import React, { useState } from "react";
import { postMessage } from "../../routes/chat.js";

export default function ShiftReportForm({ paramedic, onSystemMessage }) {
  const [query, setQuery] = useState("What's my schedule this week?");
  const [response, setResponse] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [status, setStatus] = useState("");

  const handleAsk = async () => {
    setStatus("");
    const data = await postMessage({
      paramedic_id: paramedic.paramedic_id,
      message: query,
      isVoice: false,
      conversation_id: conversationId
    });
    if (!conversationId) {
      setConversationId(data.conversation_id);
    }
    setResponse(data.reply || "");
    setStatus("Shift report updated.");
    onSystemMessage?.("Shift report pulled.");
  };

  return (
    <div>
      <h3>Online Paramedic Shift Report</h3>
      <label>Ask about schedule</label>
      <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button className="btn" type="button" onClick={handleAsk}>
        Get Shift Info
      </button>
      {status && <div style={{ marginTop: "8px", color: "#22c55e" }}>{status}</div>}
      {response && (
        <div style={{ marginTop: "12px", padding: "12px", border: "1px solid #1f2937", borderRadius: "8px" }}>
          {response}
        </div>
      )}
    </div>
  );
}
