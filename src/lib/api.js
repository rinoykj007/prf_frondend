import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
console.log("process.env.BASE_URL", process.env.BASE_URL);
console.log("process.env.ALLOWED_HOST", process.env.ALLOWED_HOST);
export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});
