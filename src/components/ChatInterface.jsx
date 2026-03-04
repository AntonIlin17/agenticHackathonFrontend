import React, { useEffect, useRef, useState } from "react";
import { postMessage } from "../routes/chat.js";
import FormPanel from "./FormPanel.jsx";
import FormsHub from "./forms/FormsHub.jsx";
import recordingVideo from "../assets/Recording 2026-03-03 144646.mp4";
import "./ChatInterface.css";

export default function ChatInterface({ paramedic, briefing, onShiftComplete }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: briefing }
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [extracted, setExtracted] = useState({});
  const [guardrails, setGuardrails] = useState({});
  const [mode, setMode] = useState("normal");
  const [inputMode, setInputMode] = useState("voice"); // "voice" | "type"
  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // AI speaks replies when ON
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);

  function speak(text) {
    if (!voiceEnabled || !text || typeof text !== "string") return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && sendMessageRef.current) sendMessageRef.current(transcript, true);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const sendMessage = async (content, isVoice = false) => {
    if (!content || sending) return;
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    try {
      const data = await postMessage({
        paramedic_id: paramedic.paramedic_id,
        message: content,
        isVoice,
        conversation_id: conversationId
      });
      if (!conversationId) setConversationId(data.conversation_id);
      setMode(data.mode || "normal");
      setExtracted(data.extracted || {});
      setGuardrails(data.guardrails || {});
      const replyText =
        data.reply != null && typeof data.reply === "string"
          ? data.reply
          : "No reply from ParaHelper.";
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
      speak(replyText);
    } catch (err) {
      console.error("Chat error", err);
      const msg =
        err?.userMessage ||
        err?.response?.data?.message ||
        "ParaHelper couldn't reply because the backend chat service failed.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      speak(msg);
    } finally {
      setSending(false);
    }
  };
  sendMessageRef.current = sendMessage;

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleTypeSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input.trim(), false);
  };

  const isAiActive = listening || sending;
  const paramedicInitials = [paramedic.first_name, paramedic.last_name]
    .map((n) => (n || "").charAt(0))
    .join("")
    .toUpperCase() || "P";

  return (
    <div className="chat-interface app-shell">
      <header className="chat-header">
        <span className="chat-header-mode">
          Mode: {mode === "stress" ? "Stress" : "Normal"}
        </span>
        <button
          type="button"
          className={`chat-voice-toggle ${voiceEnabled ? "chat-voice-toggle--on" : ""}`}
          onClick={() => setVoiceEnabled((v) => !v)}
          title={voiceEnabled ? "AI voice on – click to turn off" : "AI voice off – click to turn on"}
        >
          {voiceEnabled ? "🔊 Voice on" : "🔊 Voice off"}
        </button>
        <button
          type="button"
          className="chat-header-end-btn"
          onClick={onShiftComplete}
        >
          End Shift
        </button>
      </header>

      <div className="chat-layout">
        {/* Left: Paramedic profile card */}
        <aside className="chat-profile-card">
          <div className="chat-profile-photo-wrap">
            {paramedic.photo_url ? (
              <img
                src={paramedic.photo_url}
                alt={`${paramedic.first_name} ${paramedic.last_name}`}
                className="chat-profile-photo"
              />
            ) : (
              <div className="chat-profile-initials">{paramedicInitials}</div>
            )}
          </div>
          <h2 className="chat-profile-name">
            {paramedic.first_name} {paramedic.last_name}
          </h2>
          <p className="chat-profile-role">{paramedic.role || "Paramedic"}</p>
          <p className="chat-profile-desc">
            {paramedic.station
              ? `Station ${paramedic.station} · On shift`
              : "Paramedic on duty. Use voice or type to talk to ParaHelper."}
          </p>
        </aside>

        {/* Center: AI interaction + conversation */}
        <main className="chat-main">
          <div className="chat-ai-zone">
            <p className="chat-ai-label">
              {inputMode === "voice" ? "Speak to ParaHelper" : "Type your message"}
            </p>

            {inputMode === "voice" ? (
              <div className="chat-voice-row">
                <p className="chat-voice-hint">Tap the circle to speak, or switch to text below.</p>
                <button
                  type="button"
                  className={`chat-circle-btn chat-orb ${isAiActive ? "chat-circle-btn--active" : ""}`}
                  onClick={toggleVoice}
                  disabled={sending}
                  aria-label={listening ? "Stop listening" : "Start voice input"}
                >
                  <video
                    className="chat-circle-video"
                    src={recordingVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden
                  />
                </button>
                <button
                  type="button"
                  className="chat-switch-mode-btn"
                  onClick={() => setInputMode("type")}
                >
                  Prefer to type?
                </button>
              </div>
            ) : (
              <div className="chat-type-row">
                <form onSubmit={handleTypeSubmit} className="chat-type-form">
                  <input
                    type="text"
                    className="chat-type-input"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="chat-type-send"
                    disabled={sending || !input.trim()}
                  >
                    Send
                  </button>
                </form>
                <button
                  type="button"
                  className="chat-switch-mode-btn"
                  onClick={() => setInputMode("voice")}
                >
                  Use voice instead
                </button>
              </div>
            )}
            <button
              type="button"
              className="chat-occurrence-trigger"
              onClick={() => sendMessage("I need to file an EMS occurrence report", false)}
              disabled={sending}
            >
              Start EMS Occurrence Report
            </button>
          </div>

          <div className="chat-messages-wrap">
            <div className="chat-messages" role="log">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-msg chat-msg--${msg.role}`}
                >
                  <strong className="chat-msg-role">
                    {msg.role === "user" ? "You" : "ParaHelper"}:
                  </strong>{" "}
                  <span className="chat-msg-content">{msg.content}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right: Forms */}
        <aside className="chat-forms-sidebar">
          <FormsHub
            paramedic={paramedic}
            onSystemMessage={(content) => {
              setMessages((prev) => [...prev, { role: "assistant", content }]);
              speak(content);
            }}
          />
          <FormPanel
            paramedicId={paramedic.paramedic_id}
            extracted={extracted}
            guardrails={guardrails}
            onSent={() => {
              const content = "Forms sent. Anything else?";
              setMessages((prev) => [...prev, { role: "assistant", content }]);
              speak(content);
            }}
          />
        </aside>
      </div>
    </div>
  );
}
