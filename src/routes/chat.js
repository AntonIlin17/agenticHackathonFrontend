import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://parahelper-backend-xf5t.onrender.com";

export async function postMessage({ paramedic_id, message, isVoice, conversation_id }) {
  const res = await axios.post(`${API_URL}/api/chat/message`, {
    paramedic_id,
    message,
    isVoice,
    conversation_id
  });
  return res.data;
}

export function getAudioUrl(path) {
  return `${API_URL}${path}`;
}
