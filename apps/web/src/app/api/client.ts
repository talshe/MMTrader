import axios from 'axios';

const baseURL = import.meta.env.VITE_TRADER_URL ?? 'http://localhost:4000/api';

export const api = axios.create({
  baseURL,
  timeout: 10_000
});

