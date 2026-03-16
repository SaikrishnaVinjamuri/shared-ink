import axios from "axios";

export const api = axios.create({
  baseURL: "https://shared-ink.onrender.com",
  withCredentials: true,
});

export const refreshClient = axios.create({
  baseURL: "https://shared-ink.onrender.com",
  withCredentials: true,
});
