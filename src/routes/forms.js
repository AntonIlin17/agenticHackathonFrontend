import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://parahelper-backend-xf5t.onrender.com";

export async function validateForms({ extracted }) {
  const res = await axios.post(`${API_URL}/api/forms/validate`, { extracted });
  return res.data;
}

export async function sendForms({ paramedic_id, extracted }) {
  const res = await axios.post(`${API_URL}/api/forms/send`, {
    paramedic_id,
    extracted
  });
  return res.data;
}

export async function submitVehicleCheck(payload) {
  const res = await axios.post(`${API_URL}/api/forms/vehicle-check`, payload);
  return res.data;
}

export async function submitEquipmentInventory(payload) {
  const res = await axios.post(`${API_URL}/api/forms/equipment-inventory`, payload);
  return res.data;
}
