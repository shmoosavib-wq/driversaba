import API from "../api-manager";

export const getUserInfo = () =>
  API.get("/Account/Info").then((res) => res.data.Content);

export const postUserInfo = (userInfoData) =>
  API.post("Account", userInfoData, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  }).then((res) => res.data.Content);

export const getDegrees = () =>
  API.get("Dropdown/Degrees").then((res) => res.data.Content);

export const getCities = () =>
  API.get("Dropdown/CitiesAndTheirProvinces").then((res) => res.data.Content);

export const postCompanyInformation = (companyInformationData: any) =>
  API.post("Authentication/CompanyAuthentic", companyInformationData).then(
    (res) => res.data.Content
  );

export const postAuthentication = (authenticationData) =>
  API.post("/Authentication", authenticationData).then(
    (res) => res.data.Content
  );

export const addVehicle = (vehicleData) =>
  API.post("/Equipment", vehicleData).then((res) => res.data.Content);
