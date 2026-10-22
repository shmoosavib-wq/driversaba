import API from "../api-manager";
import sabaServiceApi from "../sabaService/api";

export const getDriverEquipments = (logisticReqAppId: string) =>
  API.get(`Driver/Equipments?logisticRequestAppId=${logisticReqAppId}`).then(
    (res) => res.data.Content
  );

export const postAcceptLoad = ({
  LogisticRequestAppId,
  TransportEquipmentId,
  SecondDriverId,
}) =>
  API.post(
    `Driver/AcceptLoad?LogisticRequestAppId=${LogisticRequestAppId}&TransportEquipmentId=${TransportEquipmentId}&SecondDriverId=${SecondDriverId ?? ""} `
  ).then((res) => res.data.Content);

export const getWeekDays = () =>
  API.get("/Driver/WeekDays").then((res) => res.data.Content);

export const getCargoDetail = (LogisticRequestAppId) =>
  API.get(
    `/Driver/CargoDetail?LogisticRequestAppId=${LogisticRequestAppId}`
  ).then((res) => res.data.Content);

export const CancellationDriver = (logisticRequestAppId) =>
  API.post(
    `/Driver/CancellationDriver?logisticRequestAppId=${logisticRequestAppId}`
  ).then((res) => res.data.Content);

export const postDriverSecondInfo = (driverInfo) =>
  sabaServiceApi
    .post("/Driver/SecondDriverInfoToAssign", driverInfo)
    .then((res) => res.data.Content);

export const postChangeAssignedSecondDriver = (editSecondDriverInfo) =>
  API.post("/Driver/ChangeAssignedSecondDriver", editSecondDriverInfo).then(
    (res) => res.data.Content
  );

export const getAuthenticationStatus = (LogisticRequestAppId) =>
  API.get(
    `/General/AuthenticationStatus?logisticRequestAppId=${LogisticRequestAppId}`
  ).then((res) => res.data.Content);

export const getLoadState = (data) =>
  API.get(
    `/Driver/MyLoadsDriver?IsProcessFinished=${data?.IsProcessFinished}&Result=${data?.Result}&Page=${data?.Page}`
  ).then((res) => res.data.Content);

export const Weighbridge = (Data) =>
  API.post("/Driver/InsertWeighbridgePhotoAndRealTonnage", Data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  }).then((res) => res.data.Content);

export const getCargoLocations = () =>
  API.get(" /Dropdown/CargoLocations").then((res) => res.data.Content);

export const getCargoCancelReason = () =>
  API.get("/Dropdown/GetCancelReasonByType").then((res) => res.data.Content);
export const CancellationReason = (data) =>
  API.post("/General/LoadCancelation", data).then((res) => res.data.Content);

export const getMovement = (logisticReqAppId) =>
  API.get(`/Driver/Movement?logisticRequestAppId=${logisticReqAppId}`).then(
    (res) => res.data.Content
  );

export const getInviteData = () =>
  API.get("/Invite").then((res) => res.data.Content);
