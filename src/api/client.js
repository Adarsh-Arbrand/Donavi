// src/api/client.js
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API base URL
  withCredentials: true,
});

export default client;
