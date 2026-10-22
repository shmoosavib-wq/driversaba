import API from "./api-manager";
import { MockApi } from "./mock-api";
import { coargoDetail } from "./mock-data";

export const login = (loginData) =>
  API.post("/Login", loginData).then((res) => res.data.Content);

export const verifyApi = (verifyData) =>
  API.post("/Login/CodeVerification", verifyData).then(
    (res) => res.data.Content
  );

export const postSelection = (userSelect) =>
  API.post("/Account/PostSelection", userSelect).then(
    (res) => res.data.Content
  );

export const cargoDetailApi = () => MockApi(coargoDetail);
