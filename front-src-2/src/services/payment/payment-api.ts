import API from "../api-manager";

export const addSheba = (shebaNamber) =>
  API.post("/Payment/Account", shebaNamber).then((res) => res.data.Content);
export const getShebaCart = (logisticRequestAppId) =>
  API.get(
    `/Payment/ShebaCarts?logisticRequestAppId=${logisticRequestAppId}`
  ).then((res) => res.data.Content);
export const getSabaCart = (logisticRequestAppId) =>
  API.get(
    `/Payment/SabaCarts?logisticRequestAppId=${logisticRequestAppId}`
  ).then((res) => res.data.Content);

export const selectDeopsitWay = (data) =>
  API.post("/Payment", data).then((res) => res.data.Content);

export const submitPoll = (data) =>
  API.post("/Poll", data).then((res) => res.data.Content);
