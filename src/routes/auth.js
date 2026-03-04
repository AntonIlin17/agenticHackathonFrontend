import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://parahelper-backend-xf5t.onrender.com";

export async function login({ paramedic_id }) {
  const res = await axios.post(`${API_URL}/api/auth/login`, {
    paramedic_id
  });
  return res.data;
}
