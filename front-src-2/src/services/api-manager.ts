import axios from "axios";

import Cookies from "js-cookie";

const baseURL = process.env.REACT_APP_BASE_URL;

const API = axios.create({
  baseURL: baseURL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    // 'Content-Type': 'multipart/form-data',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  },
});

// instance request
API.interceptors.request.use((config) => {
  const token = Cookies.get("Token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// instance response & handle Unauthorized error
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("Token");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default API;
