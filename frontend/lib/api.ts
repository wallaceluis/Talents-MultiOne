// lib/api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function getCompanies() {
  const res = await axios.get(`${API_URL}/companies`);
  return res.data;
}
