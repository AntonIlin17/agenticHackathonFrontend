import React, { useState } from "react";
import { sendForms } from "../../routes/forms.js";
import { toField, today } from "./formHelpers.js";

export default function OccurrenceForm({ paramedic, onSystemMessage }) {
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [occurrenceType, setOccurrenceType] = useState("");
  const [occurrenceRef, setOccurrenceRef] = useState("");
  const [description, setDescription] = useState("");
  const [immediateActions, setImmediateActions] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [location, setLocation] = useState("");
  const [injuriesReported, setInjuriesReported] = useState("");
  const [equipmentDamage, setEquipmentDamage] = useState("");
  const [supervisorNotified, setSupervisorNotified] = useState("");
  const [otherServices, setOtherServices] = useState("");
  const [suggestedResolution, setSuggestedResolution] = useState("");
  const [managementNotes, setManagementNotes] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    const extracted = {
      occurrence_report: {
        date: toField(date),
        time: toField(time),
        call_number: toField(callNumber),
        occurrence_type: toField(occurrenceType),
        occurrence_reference: toField(occurrenceRef),
        vehicle_number: toField(paramedic.unit_number || paramedic.unit || ""),
        vehicle_description: toField(paramedic.vehicle_description || ""),
        service: toField(paramedic.service || "EMS"),
        role: toField(paramedic.role || ""),
        badge_number: toField(paramedic.badge_number || ""),
        paramedic_name: toField(`${paramedic.first_name} ${paramedic.last_name}`),
        description: toField(description),
        immediate_actions: toField(immediateActions),
        requested_by: toField(requestedBy),
        report_creator: toField(`${paramedic.first_name} ${paramedic.last_name}`),
        location: toField(location),
        injuries_reported: toField(injuriesReported),
        equipment_damage: toField(equipmentDamage),
        supervisor_notified: toField(supervisorNotified),
        other_services_involved: toField(otherServices),
        suggested_resolution: toField(suggestedResolution),
        management_notes: toField(managementNotes)
      }
    };

    await sendForms({ paramedic_id: paramedic.paramedic_id, extracted });
    setStatus("Occurrence Report sent.");
    onSystemMessage?.("Occurrence Report sent. Anything else?");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>EMS Occurrence Report</h3>
      <div className="layout" style={{ gap: "12px" }}>
        <div>
          <label>Date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label>Time</label>
          <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <label>Call Number</label>
      <input className="input" value={callNumber} onChange={(e) => setCallNumber(e.target.value)} />

      <label>Occurrence Type</label>
      <select className="input" value={occurrenceType} onChange={(e) => setOccurrenceType(e.target.value)}>
        <option value="">Select</option>
        <option value="call_related">Call-related</option>
        <option value="non_call_related">Non-call-related</option>
      </select>

      <label>Occurrence Reference</label>
      <input className="input" value={occurrenceRef} onChange={(e) => setOccurrenceRef(e.target.value)} />

      <label>Brief Description</label>
      <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Immediate Actions</label>
      <textarea className="input" value={immediateActions} onChange={(e) => setImmediateActions(e.target.value)} />

      <label>Requested By</label>
      <input className="input" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} />

      <label>Location</label>
      <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />

      <div className="layout" style={{ gap: "12px" }}>
        <div>
          <label>Injuries Reported</label>
          <select
            className="input"
            value={injuriesReported}
            onChange={(e) => setInjuriesReported(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label>Equipment Damage</label>
          <select
            className="input"
            value={equipmentDamage}
            onChange={(e) => setEquipmentDamage(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <label>Supervisor Notified</label>
      <select
        className="input"
        value={supervisorNotified}
        onChange={(e) => setSupervisorNotified(e.target.value)}
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      <label>Other Services Involved</label>
      <input className="input" value={otherServices} onChange={(e) => setOtherServices(e.target.value)} />

      <label>Suggested Resolution</label>
      <textarea className="input" value={suggestedResolution} onChange={(e) => setSuggestedResolution(e.target.value)} />

      <label>Management Notes</label>
      <textarea className="input" value={managementNotes} onChange={(e) => setManagementNotes(e.target.value)} />

      <div style={{ marginTop: "12px" }}>
        <button className="btn" type="submit">Send Occurrence Report</button>
        {status && <span style={{ marginLeft: "12px", color: "#22c55e" }}>{status}</span>}
      </div>
    </form>
  );
}
