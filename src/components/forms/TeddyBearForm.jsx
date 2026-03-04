import React, { useState } from "react";
import { sendForms } from "../../routes/forms.js";
import { toField, nowLocal } from "./formHelpers.js";

export default function TeddyBearForm({ paramedic, onSystemMessage }) {
  const [dateTime, setDateTime] = useState(nowLocal());
  const [recipientAge, setRecipientAge] = useState("");
  const [recipientGender, setRecipientGender] = useState("");
  const [recipientType, setRecipientType] = useState("");
  const [secondFirst, setSecondFirst] = useState("");
  const [secondLast, setSecondLast] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    const extracted = {
      teddy_bear: {
        date_time: toField(dateTime),
        primary_medic_first: toField(paramedic.first_name || ""),
        primary_medic_last: toField(paramedic.last_name || ""),
        medic_number: toField(paramedic.badge_number || ""),
        recipient_age: toField(recipientAge),
        recipient_gender: toField(recipientGender),
        recipient_type: toField(recipientType),
        second_medic_first: toField(secondFirst),
        second_medic_last: toField(secondLast),
        second_medic_number: toField(secondNumber)
      }
    };

    await sendForms({ paramedic_id: paramedic.paramedic_id, extracted });
    setStatus("Teddy Bear Form sent.");
    onSystemMessage?.("Teddy Bear Form sent. Anything else?");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Teddy Bear Comfort Program</h3>
      <label>Date / Time</label>
      <input
        className="input"
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />

      <div className="layout" style={{ gap: "12px" }}>
        <div>
          <label>Primary Medic First</label>
          <input className="input" value={paramedic.first_name || ""} readOnly />
        </div>
        <div>
          <label>Primary Medic Last</label>
          <input className="input" value={paramedic.last_name || ""} readOnly />
        </div>
      </div>

      <label>Medic Number</label>
      <input className="input" value={paramedic.badge_number || ""} readOnly />

      <h4 style={{ marginTop: "12px" }}>Second Medic (Optional)</h4>
      <div className="layout" style={{ gap: "12px" }}>
        <div>
          <label>First Name</label>
          <input className="input" value={secondFirst} onChange={(e) => setSecondFirst(e.target.value)} />
        </div>
        <div>
          <label>Last Name</label>
          <input className="input" value={secondLast} onChange={(e) => setSecondLast(e.target.value)} />
        </div>
      </div>
      <label>Medic Number</label>
      <input className="input" value={secondNumber} onChange={(e) => setSecondNumber(e.target.value)} />

      <h4 style={{ marginTop: "12px" }}>Recipient</h4>
      <label>Age</label>
      <input className="input" value={recipientAge} onChange={(e) => setRecipientAge(e.target.value)} />

      <label>Gender</label>
      <select className="input" value={recipientGender} onChange={(e) => setRecipientGender(e.target.value)}>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>

      <label>Recipient Type</label>
      <select className="input" value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
        <option value="">Select</option>
        <option value="Patient">Patient</option>
        <option value="Family">Family</option>
        <option value="Bystander">Bystander</option>
        <option value="Other">Other</option>
      </select>

      <div style={{ marginTop: "12px" }}>
        <button className="btn" type="submit">Send Teddy Bear Form</button>
        {status && <span style={{ marginLeft: "12px", color: "#22c55e" }}>{status}</span>}
      </div>
    </form>
  );
}
