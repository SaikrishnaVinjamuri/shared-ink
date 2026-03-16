import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const refreshClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
