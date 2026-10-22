import API from "../api-manager";

export const getUserProfileDetail = () =>
  API.get("/Account/ProfileInfo").then((res) => res.data.Content);
