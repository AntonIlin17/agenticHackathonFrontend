import React from "react";

function fieldValue(field) {
  if (!field) return "—";
  if (typeof field === "object" && "value" in field) {
    return field.value || "—";
  }
  return field || "—";
}

function fieldClass(field) {
  if (!field) return "form-field missing";
  if (typeof field === "object") {
    if (field.confidence === "low") return "form-field warn";
    return "form-field ok";
  }
  return "form-field ok";
}

export default function LiveFormPanel({ extracted }) {
  const occurrence = extracted?.occurrence_report;
  const teddy = extracted?.teddy_bear;
  const status = extracted?.status_report;
  const shift = extracted?.shift_report;

  return (
    <div className="card live-forms">
      <h3 style={{ marginTop: 0 }}>Live Form Filling</h3>

      {!occurrence && !teddy && !status && !shift && (
        <div style={{ color: "#94a3b8" }}>No active forms yet.</div>
      )}

      {occurrence && (
        <div className="form-preview">
          <div className="form-header occurrence">
            <div>
              <div className="form-title">EMS Occurrence Report</div>
              <div className="form-subtitle">Incident Documentation</div>
            </div>
            <div className="form-stamp">In progress</div>
          </div>

          <div className="form-section">
            <div className="section-title">Incident Overview</div>
            <div className="form-grid">
              <div>
                <label>Date</label>
                <div className={fieldClass(occurrence.date)}>{fieldValue(occurrence.date)}</div>
              </div>
              <div>
                <label>Time</label>
                <div className={fieldClass(occurrence.time)}>{fieldValue(occurrence.time)}</div>
              </div>
              <div>
                <label>Call Number</label>
                <div className={fieldClass(occurrence.call_number)}>
                  {fieldValue(occurrence.call_number)}
                </div>
              </div>
              <div>
                <label>Occurrence Type</label>
                <div className={fieldClass(occurrence.occurrence_type)}>
                  {fieldValue(occurrence.occurrence_type)}
                </div>
              </div>
              <div className="full">
                <label>Occurrence Reference</label>
                <div className={fieldClass(occurrence.occurrence_reference)}>
                  {fieldValue(occurrence.occurrence_reference)}
                </div>
              </div>
              <div className="full">
                <label>Brief Description</label>
                <div className={fieldClass(occurrence.description)}>
                  {fieldValue(occurrence.description)}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Service & Vehicle</div>
            <div className="form-grid">
              <div>
                <label>Service</label>
                <div className={fieldClass(occurrence.service)}>{fieldValue(occurrence.service)}</div>
              </div>
              <div>
                <label>Vehicle</label>
                <div className={fieldClass(occurrence.vehicle_number)}>
                  {fieldValue(occurrence.vehicle_number)}
                </div>
              </div>
              <div className="full">
                <label>Vehicle Description</label>
                <div className={fieldClass(occurrence.vehicle_description)}>
                  {fieldValue(occurrence.vehicle_description)}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Personnel</div>
            <div className="form-grid">
              <div>
                <label>Role</label>
                <div className={fieldClass(occurrence.role)}>{fieldValue(occurrence.role)}</div>
              </div>
              <div>
                <label>Badge</label>
                <div className={fieldClass(occurrence.badge_number)}>
                  {fieldValue(occurrence.badge_number)}
                </div>
              </div>
              <div className="full">
                <label>Paramedic Name</label>
                <div className={fieldClass(occurrence.paramedic_name)}>
                  {fieldValue(occurrence.paramedic_name)}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Report Details</div>
            <div className="form-grid">
              <div className="full">
                <label>Action Taken</label>
                <div className={fieldClass(occurrence.immediate_actions)}>
                  {fieldValue(occurrence.immediate_actions)}
                </div>
              </div>
              <div className="full">
                <label>Suggested Resolution</label>
                <div className={fieldClass(occurrence.suggested_resolution)}>
                  {fieldValue(occurrence.suggested_resolution)}
                </div>
              </div>
              <div className="full">
                <label>Management Notes</label>
                <div className={fieldClass(occurrence.management_notes)}>
                  {fieldValue(occurrence.management_notes)}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Submission Info</div>
            <div className="form-grid">
              <div>
                <label>Requested By</label>
                <div className={fieldClass(occurrence.requested_by)}>
                  {fieldValue(occurrence.requested_by)}
                </div>
              </div>
              <div>
                <label>Report Creator</label>
                <div className={fieldClass(occurrence.report_creator)}>
                  {fieldValue(occurrence.report_creator)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {teddy && (
        <div className="form-preview">
          <div className="form-header teddy">
            <div>
              <div className="form-title">Teddy Bear Comfort Program</div>
              <div className="form-subtitle">Patient Comfort Tracking</div>
            </div>
            <div className="form-stamp">In progress</div>
          </div>

          <div className="form-section">
            <div className="section-title">Date & Time of Distribution</div>
            <div className="form-grid">
              <div className="full">
                <label>Date / Time</label>
                <div className={fieldClass(teddy.date_time)}>{fieldValue(teddy.date_time)}</div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Primary Medic (Required)</div>
            <div className="form-grid">
              <div>
                <label>First Name</label>
                <div className={fieldClass(teddy.primary_medic_first)}>
                  {fieldValue(teddy.primary_medic_first)}
                </div>
              </div>
              <div>
                <label>Last Name</label>
                <div className={fieldClass(teddy.primary_medic_last)}>
                  {fieldValue(teddy.primary_medic_last)}
                </div>
              </div>
              <div className="full">
                <label>Medic Number</label>
                <div className={fieldClass(teddy.medic_number)}>
                  {fieldValue(teddy.medic_number)}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Second Medic (Optional)</div>
            <div className="form-grid">
              <div>
                <label>First Name</label>
                <div className={fieldClass(teddy.second_medic_first)}>
                  {fieldValue(teddy.second_medic_first)}
                </div>
              </div>
              <div>
                <label>Last Name</label>
                <div className={fieldClass(teddy.second_medic_last)}>
                  {fieldValue(teddy.second_medic_last)}
                </div>
              </div>
              <div className="full">
                <label>Medic Number</label>
                <div className={fieldClass(teddy.second_medic_number)}>
                  {fieldValue(teddy.second_medic_number)}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Recipient</div>
            <div className="form-grid">
              <div>
                <label>Age</label>
                <div className={fieldClass(teddy.recipient_age)}>
                  {fieldValue(teddy.recipient_age)}
                </div>
              </div>
              <div>
                <label>Gender</label>
                <div className={fieldClass(teddy.recipient_gender)}>
                  {fieldValue(teddy.recipient_gender)}
                </div>
              </div>
              <div className="full">
                <label>Recipient Type</label>
                <div className={fieldClass(teddy.recipient_type)}>
                  {fieldValue(teddy.recipient_type)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {status && (
        <div className="form-preview">
          <div className="form-header status">
            <div>
              <div className="form-title">Paramedic Checklist</div>
              <div className="form-subtitle">EffectiveAI Paramedic Services</div>
            </div>
            <div className="form-stamp">In progress</div>
          </div>
          <div className="form-section">
            <div className="section-title">Status Report</div>
            <div className="form-grid">
              <div className="full">
                <label>Request</label>
                <div className={fieldClass(status.request)}>{fieldValue(status.request)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {shift && (
        <div className="form-preview">
          <div className="form-header shift">
            <div>
              <div className="form-title">Online Paramedic Shift Report</div>
              <div className="form-subtitle">Schedule Overview</div>
            </div>
            <div className="form-stamp">Query</div>
          </div>
          <div className="form-section">
            <div className="section-title">Request</div>
            <div className="form-grid">
              <div className="full">
                <label>Query</label>
                <div className={fieldClass(shift.query)}>{fieldValue(shift.query)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
