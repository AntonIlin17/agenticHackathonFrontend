import React, { useState } from "react";
import { submitEquipmentInventory } from "../routes/forms.js";

const STATUS_OPTIONS = [
  { value: "ok", label: "OK" },
  { value: "low", label: "Low Stock" },
  { value: "missing", label: "Missing" },
  { value: "expired", label: "Expired" }
];

const DEFAULT_ITEMS = [
  { name: "Oxygen Masks", quantity: "10", status: "ok" },
  { name: "IV Kits", quantity: "6", status: "ok" },
  { name: "Bandages", quantity: "15", status: "ok" },
  { name: "Gloves", quantity: "1 Box", status: "low" },
  { name: "Saline Bags", quantity: "4", status: "ok" },
  { name: "Epinephrine", quantity: "2", status: "ok" }
];

const DEFAULT_EXPIRY_ITEMS = [
  { name: "Epinephrine", expiry_date: "", status: "ok" },
  { name: "Saline Bags", expiry_date: "", status: "ok" },
  { name: "IV Fluids", expiry_date: "", status: "ok" }
];

export default function EquipmentInventoryForm({ paramedic }) {
  const [unitNumber, setUnitNumber] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [expiryItems, setExpiryItems] = useState(DEFAULT_EXPIRY_ITEMS);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const updateExpiryItem = (index, field, value) => {
    setExpiryItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (reportType) => {
    try {
      setSubmitting(true);
      setStatus("");
      await submitEquipmentInventory({
        paramedic_id: paramedic.paramedic_id,
        paramedic_name: `${paramedic.first_name} ${paramedic.last_name}`,
        unit_number: unitNumber,
        shift_date: shiftDate,
        items,
        expiry_items: expiryItems,
        notes,
        report_type: reportType
      });
      setStatus(
        reportType === "restock"
          ? "Restock request submitted."
          : "Equipment inventory submitted."
      );
    } catch (err) {
      setStatus("Failed to submit equipment inventory.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusSelect = (value, onChange) => (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "4px 6px" }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="card" style={{ marginTop: "16px" }}>
      <h3>Ambulance Equipment Inventory</h3>

      <div style={{ marginBottom: "8px", fontSize: "13px", color: "#64748b" }}>
        Check medical supplies and expiry dates inside the ambulance.
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
              Unit Number
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
        </div>
      </div>

      <h4 style={{ marginTop: "8px" }}>Equipment Checklist</h4>
      <div style={{ fontSize: "13px", marginBottom: "4px" }}>
        Item Name | Quantity | Status
      </div>
      <div>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "6px",
              marginBottom: "4px"
            }}
          >
            <input
              className="input"
              value={item.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
            />
            <input
              className="input"
              value={item.quantity}
              onChange={(e) => updateItem(idx, "quantity", e.target.value)}
            />
            {renderStatusSelect(item.status, (value) => updateItem(idx, "status", value))}
          </div>
        ))}
      </div>

      <h4 style={{ marginTop: "12px" }}>Expiry Check</h4>
      <div style={{ fontSize: "13px", marginBottom: "4px" }}>
        Item | Expiry Date | Status
      </div>
      <div>
        {expiryItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "6px",
              marginBottom: "4px"
            }}
          >
            <input
              className="input"
              value={item.name}
              onChange={(e) => updateExpiryItem(idx, "name", e.target.value)}
            />
            <input
              type="date"
              className="input"
              value={item.expiry_date}
              onChange={(e) => updateExpiryItem(idx, "expiry_date", e.target.value)}
            />
            {renderStatusSelect(item.status, (value) =>
              updateExpiryItem(idx, "status", value)
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "8px" }}>
        <label style={{ fontSize: "13px", display: "block", marginBottom: "2px" }}>
          Notes / Missing Items
        </label>
        <textarea
          className="input"
          rows={3}
          placeholder='e.g., "Gloves almost finished. Need restock before next shift."'
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
          onClick={() => handleSubmit("inventory")}
        >
          Submit Inventory
        </button>
        <button
          className="btn secondary"
          disabled={submitting}
          onClick={() => handleSubmit("restock")}
        >
          Request Restock
        </button>
      </div>
    </div>
  );
}

