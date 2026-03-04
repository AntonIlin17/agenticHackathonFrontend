import React, { useState } from "react";
import { submitVehicleCheck } from "../routes/forms.js";

const CONDITION_OPTIONS = [
  { value: "ok", label: "OK" },
  { value: "needs_attention", label: "Needs Attention" }
];

export default function VehicleInventoryForm({ paramedic }) {
  const [unitNumber, setUnitNumber] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const [stationLocation, setStationLocation] = useState("");
  const [checks, setChecks] = useState({
    engine_condition: "ok",
    fuel_level: "ok",
    tire_pressure: "ok",
    emergency_lights: "ok",
    siren_system: "ok",
    gps_navigation: "ok",
    radio_communication: "ok",
    cleanliness: "ok"
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const updateCheck = (key, value) => {
    setChecks((prev) => ({ ...prev, [key]: value }));
  };

  const basePayload = () => ({
    paramedic_id: paramedic.paramedic_id,
    paramedic_name: `${paramedic.first_name} ${paramedic.last_name}`,
    unit_number: unitNumber,
    shift_date: shiftDate,
    shift_time: shiftTime,
    station_location: stationLocation,
    checks,
    notes
  });

  const handleSubmit = async (reportType) => {
    try {
      setSubmitting(true);
      setStatus("");
      await submitVehicleCheck({
        ...basePayload(),
        report_type: reportType
      });
      setStatus(
        reportType === "maintenance"
          ? "Maintenance issue reported."
          : "Vehicle inventory report submitted."
      );
    } catch (err) {
      setStatus("Failed to submit vehicle check.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelect = (label, key) => (
    <div style={{ marginBottom: "8px" }}>
      <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>{label}</label>
      <select
        className="input"
        value={checks[key]}
        onChange={(e) => updateCheck(key, e.target.value)}
        style={{ padding: "6px 8px" }}
      >
        {CONDITION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="card" style={{ marginTop: "16px" }}>
      <h3>Ambulance Vehicle Inventory (Car Check)</h3>

      <div style={{ marginBottom: "8px", fontSize: "13px", color: "#64748b" }}>
        Start-of-shift check for the ambulance vehicle.
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ marginBottom: "6px" }}>
          <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>
            Paramedic Name
          </label>
          <input
            className="input"
            value={`${paramedic.first_name} ${paramedic.last_name}`}
            disabled
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>
              Unit Number / Ambulance ID
            </label>
            <input
              className="input"
              placeholder="e.g., A-12"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>
              Shift Date
            </label>
            <input
              type="date"
              className="input"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>
              Shift Time
            </label>
            <input
              type="time"
              className="input"
              value={shiftTime}
              onChange={(e) => setShiftTime(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: "6px" }}>
          <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>
            Station Location
          </label>
          <input
            className="input"
            placeholder="Station / base location"
            value={stationLocation}
            onChange={(e) => setStationLocation(e.target.value)}
          />
        </div>
      </div>

      <h4 style={{ marginTop: "8px" }}>Vehicle Condition</h4>
      {renderSelect("Engine condition", "engine_condition")}
      {renderSelect("Fuel level", "fuel_level")}
      {renderSelect("Tire pressure", "tire_pressure")}
      {renderSelect("Emergency lights", "emergency_lights")}
      {renderSelect("Siren system", "siren_system")}
      {renderSelect("GPS / navigation system", "gps_navigation")}
      {renderSelect("Radio communication", "radio_communication")}
      {renderSelect("Ambulance cleanliness", "cleanliness")}

      <div style={{ marginTop: "8px" }}>
        <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>
          Issues / Notes
        </label>
        <textarea
          className="input"
          rows={3}
          placeholder='e.g., "Right rear tire slightly low pressure. Oxygen tank at 60%."'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ resize: "vertical" }}
        />
      </div>

      {status && (
        <div style={{ marginTop: "8px", fontSize: "13px", color: "#22c55e" }}>{status}</div>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button
          className="btn"
          disabled={submitting}
          onClick={() => handleSubmit("standard")}
        >
          Submit Report
        </button>
        <button
          className="btn secondary"
          disabled={submitting}
          onClick={() => handleSubmit("maintenance")}
        >
          Report Maintenance Issue
        </button>
      </div>
    </div>
  );
}

