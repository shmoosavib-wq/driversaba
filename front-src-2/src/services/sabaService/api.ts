import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const sabaServiceApi = axios.create({
  baseURL: baseURL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    // 'Content-Type': 'multipart/form-data',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  },
});
export default sabaServiceApi;
