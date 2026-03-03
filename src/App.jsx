import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface.jsx";
import ShiftSummary from "./components/ShiftSummary.jsx";

export default function App() {
  const [paramedic, setParamedic] = useState({
    paramedic_id: "demo-paramedic",
    first_name: "Demo",
    last_name: "Paramedic",
    role: "EMT"
  });
  const [briefing] = useState("Welcome! Ask a question to see forms appear.");
  const [shiftComplete, setShiftComplete] = useState(false);

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
