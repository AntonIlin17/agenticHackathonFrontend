import React, { useEffect, useRef, useState } from "react";
import { postMessage } from "../routes/chat.js";
import recordingVideo from "../assets/Recording 2026-03-03 144646.mp4";
import "./Dashboard.css";

function RecorderVideo({ className, isActive }) {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);
  return (
    <video
      ref={videoRef}
      className={className}
      src={recordingVideo}
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
}

export default function Dashboard({ paramedic }) {
  const name = `${paramedic?.first_name || ""} ${paramedic?.last_name || ""}`.trim() || "Paramedic";

  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const recognitionRef = useRef(null);
  const femaleVoiceRef = useRef(null);

  useEffect(() => {
    const pickFemaleVoice = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      const female =
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) ||
        voices.find((v) =>
          v.lang.startsWith("en") &&
          ["Samantha", "Victoria", "Karen", "Zira", "Aria"].some((n) => v.name.includes(n))
        ) ||
        voices.find((v) => v.lang.startsWith("en"));
      femaleVoiceRef.current = female || null;
    };
    pickFemaleVoice();
    window.speechSynthesis?.addEventListener("voiceschanged", pickFemaleVoice);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", pickFemaleVoice);
  }, []);

  function speak(text) {
    if (!voiceEnabled || !text || typeof text !== "string") return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    if (femaleVoiceRef.current) utterance.voice = femaleVoiceRef.current;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    const greeting = `Hi ${name}, I'm ParaHelper. How can I assist you today?`;
    setMessages([{ role: "assistant", content: greeting }]);
    speak(greeting);
  }, [name]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) sendMessage(transcript, true);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const sendMessage = async (text, isVoice = false) => {
    const content = (text ?? "").toString().trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    try {
      const data = await postMessage({
        paramedic_id: paramedic.paramedic_id,
        message: content,
        isVoice,
        conversation_id: conversationId
      });
      if (!conversationId) setConversationId(data.conversation_id);
      const reply =
        data?.reply != null && typeof data.reply === "string"
          ? data.reply
          : "No reply from ParaHelper.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "ParaHelper couldn't reply because the backend chat service failed.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      speak(msg);
    } finally {
      setSending(false);
    }
  };

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

  const quickActions = [
    { label: "Report an Accident", prompt: "I had an accident" },
    { label: "Start Occurrence Report", prompt: "I need to file an EMS occurrence report" },
    { label: "Begin Shift Report", prompt: "I want to start my shift report" },
    { label: "Ambulance Vehicle Inventory", prompt: "I need to complete an ambulance vehicle inventory check" },
    { label: "Equipment Inventory", prompt: "I need to complete an ambulance equipment inventory report" }
  ];

  return (
    <div className="ph-dashboard">
      <div className="ph-dashboard__center">
        <div className="ph-dashboard__top">
          <div className="ph-dashboard__topRow">
            <p className="ph-dashboard__greeting">Welcome back, {name}</p>
            <button
              type="button"
              className={`ph-voiceToggle ${voiceEnabled ? "ph-voiceToggle--on" : ""}`}
              onClick={() => setVoiceEnabled((v) => !v)}
              title={voiceEnabled ? "AI voice on – click to turn off" : "AI voice off – click to turn on"}
            >
              {voiceEnabled ? "🔊 Voice on" : "🔊 Voice off"}
            </button>
          </div>
          <h1 className="ph-dashboard__heading">How can ParaHelper assist you today?</h1>
        </div>

        <div className="ph-panel ph-panel--input">
          <div className="ph-inputRow">
            <input
              className="ph-input"
              placeholder="Ask ParaHelper or describe an incident..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage(input, false);
                }
              }}
              disabled={sending}
            />
            <button
              type="button"
              className={`ph-micBtn ${listening ? "is-listening" : ""}`}
              onClick={toggleVoice}
              title={listening ? "Stop voice input" : "Voice input"}
              aria-label={listening ? "Stop voice input" : "Voice input"}
            >
              <RecorderVideo className="ph-micIcon" isActive={listening} />
            </button>
          </div>
        </div>

        <div className="ph-actions">
          {quickActions.map((a) => (
            <button
              key={a.label}
              type="button"
              className="ph-actionBtn"
              onClick={() => sendMessage(a.prompt, false)}
              disabled={sending}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="ph-panel ph-panel--chat" aria-label="Chat area">
          <div className="ph-chat">
            {messages.map((m, idx) => (
              <div key={idx} className={`ph-msg ph-msg--${m.role}`}>
                <div className="ph-msg__label">{m.role === "user" ? "You" : "ParaHelper"}</div>
                <div className="ph-msg__bubble">{m.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
