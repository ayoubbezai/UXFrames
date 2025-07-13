import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});





export default api;