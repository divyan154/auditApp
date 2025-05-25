import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:3001",
  withCredentials: true,
});
export default api;
