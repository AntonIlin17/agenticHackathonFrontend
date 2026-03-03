import React, { useState } from "react";
import Login from "./components/Login.jsx";
import ChatInterface from "./components/ChatInterface.jsx";
import ShiftSummary from "./components/ShiftSummary.jsx";

export default function App() {
  const [paramedic, setParamedic] = useState(null);
  const [briefing, setBriefing] = useState("");
  const [shiftComplete, setShiftComplete] = useState(false);

  if (!paramedic) {
    return <Login onLogin={(p, b) => { setParamedic(p); setBriefing(b); }} />;
  }

  if (shiftComplete) {
    return <ShiftSummary paramedic={paramedic} onRestart={() => setShiftComplete(false)} />;
  }

  return (
    <ChatInterface
      paramedic={paramedic}
      briefing={briefing}
      onShiftComplete={() => setShiftComplete(true)}
    />
  );
}
