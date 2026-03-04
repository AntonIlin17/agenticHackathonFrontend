import React, { useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
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

  return <Dashboard paramedic={paramedic} />;
}
