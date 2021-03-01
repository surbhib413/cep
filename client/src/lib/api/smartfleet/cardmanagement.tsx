import {
  callPostPrivateAPI,
  callGetPrivateAPI,
  callDeletePrivateAPI,
  callPostPrivateFileUploadAPI,
} from "../index";

export const postCardData = async (fields: any) => {
  // const urlPath = "https://api.mocki.io/v1/bae2b66a";
  const urlPath = "/retail/v2/bpcl/smartfleet/register/cardManagement";
  const data = {
    channel: "WEB",
    bulkupload: false,
    ...fields,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const getTemplateUrl = async () => {
  // const urlPath = "https://api.mocki.io/v1/f1369c7c";
  const urlPath = "/retail/v2/bpcl/smartfleet/register/getTemplate";
  const data = {};
  const resData = callGetPrivateAPI(data, urlPath);

  return resData;
};

export const deleleteCards = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/deleteCards";
  // const urlPath = "https://api.mocki.io/v1/4f819418";
  const data = fields;
  console.log("FleetCards to be delete:", data);
  const resData = callDeletePrivateAPI(data, urlPath);
  return resData;
};

export const cardBulkUpload = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/cardsBulkUpload";
  const resData = callPostPrivateFileUploadAPI(fields, urlPath);
  return resData;
};

export const downloadErrorLog = async (fields: any) => {
  const urlPath = fields;
  const data = {
    customDownload: true,
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const getBulkUploadDetails = async () => {
  const urlPath = "/retail/v2/bpcl/smartfleet/card/bulk/details";
  const data = {};
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const getindividualCardDetails = async () => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cardHeaders?fields=DEFAULT";
  const data = {
    channel: "WEB",
    bulkupload: false,
    fields: "DEFAULT",
    offset: 10,
    page: 0,
    status: "PaymentPending",
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};
