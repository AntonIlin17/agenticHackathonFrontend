export function toField(value) {
  return { value, confidence: value ? "high" : "low" };
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function nowLocal() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
