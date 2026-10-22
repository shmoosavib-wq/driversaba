import sabaServiceApi from "./api";

export const postRemittanceRequest = (data) =>
  sabaServiceApi
    .post("/SabaService/RemittanceRequest", data)
    .then((res) => res.data.Content);

export const getRemittanceRequestInfo = (data) =>
  sabaServiceApi
    .get(`/SabaService?remittanceId=${data}`)
    .then((res) => res.data.Content);

export const postWayBillRequest = (data) =>
  sabaServiceApi
    .post("/SabaService/WayBillRequest", data, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
    .then((res) => res.data.Content);
