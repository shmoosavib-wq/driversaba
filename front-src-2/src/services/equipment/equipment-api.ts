import API from "../api-manager";

export const getFleetsInfo = () =>
  API.get("Equipment/AllInfo").then((res) => res.data.Content);

export const removeEquipment = (transportEquipmentId) =>
  API.post(`Equipment/Remove?transportEquipmentId=${transportEquipmentId}`);

export const getAllFleets = () =>
  API.get("/Dropdown/Equipments").then((res) => res.data.Content);
