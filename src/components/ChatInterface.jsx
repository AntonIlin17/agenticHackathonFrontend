import React, { useState } from "react";
import axios from "axios";
import VoiceButton from "./VoiceButton.jsx";
import FormPanel from "./FormPanel.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export default function ChatInterface({ paramedic, briefing, onShiftComplete }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: briefing }
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [extracted, setExtracted] = useState({});
  const [guardrails, setGuardrails] = useState({});
  const [mode, setMode] = useState("normal");

  const sendMessage = async (content, isVoice = false) => {
    if (!content) return;
    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    const res = await axios.post(`${API_URL}/api/chat/message`, {
      paramedic_id: paramedic.paramedic_id,
      message: content,
      isVoice,
      conversation_id: conversationId
    });
    if (!conversationId) {
      setConversationId(res.data.conversation_id);
    }
    setMode(res.data.mode || "normal");
    setExtracted(res.data.extracted || {});
    setGuardrails(res.data.guardrails || {});
    setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    if (res.data.audio_url) {
      const audio = new Audio(`${API_URL}${res.data.audio_url}`);
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="app-shell" style={{ padding: "24px" }}>
      <div className="card" style={{ marginBottom: "16px" }}>
        <strong>
          {paramedic.first_name} {paramedic.last_name} · {paramedic.role}
        </strong>
        <span style={{ marginLeft: "12px", color: "#94a3b8" }}>
          Mode: {mode === "stress" ? "Stress" : "Normal"}
        </span>
        <button
          className="btn secondary"
          style={{ float: "right" }}
          onClick={onShiftComplete}
        >
          End Shift
        </button>
      </div>

      <div className="layout">
        <div className="card" style={{ minHeight: "60vh" }}>
          <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: "12px" }}>
                <strong>{msg.role === "user" ? "You" : "ParaHelper"}:</strong>{" "}
                {msg.content}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <input
              className="input"
              style={{ marginBottom: 0 }}
              placeholder="Type here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn" onClick={() => sendMessage(input, false)}>
              Send
            </button>
            <VoiceButton onTranscript={(t) => sendMessage(t, true)} />
          </div>
        </div>

        <FormPanel
          paramedicId={paramedic.paramedic_id}
          extracted={extracted}
          guardrails={guardrails}
          onSent={() =>
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: "Forms sent. Anything else?" }
            ])
          }
        />
      </div>
    </div>
  );
}
