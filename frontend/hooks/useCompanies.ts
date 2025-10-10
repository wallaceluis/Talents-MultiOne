import axios from 'axios';

const API_URL = '/api/companies';

export async function getCompanies() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function createCompany(data: { name: string; domain: string }) {
  const res = await axios.post(API_URL, data);
  return res.data;
}
