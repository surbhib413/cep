import { callGetPrivateAPI, callPostPrivateAPI } from "../index";

// to get count of all cards in diff state
export const getCardStatusCount = async (fields: any) => {
  //const urlPath = "https://run.mocky.io/v3/ac8772b1-3972-49e9-b4d1-589035382639";
  const urlPath =
    "/retail/v2/bpcl/smartfleet/cardCount?channel=WEB&fields=DEFAULT";
  //const urlPath = "https://359fcf01a8bb.ngrok.io/retail/v2/bpcl/smartfleet/cardCount?channel=WEB&fields=DEFAULT&state=All";
  const data = {
    ...fields,
  };
  const resData = await callGetPrivateAPI(data, urlPath);

  return resData;
};

// to get all card headers
export const getCardHeaders = async (fields: any) => {
  // const urlPath = "https://api.mocki.io/v1/f1369c7c";
  const urlPath =
    "/retail/v2/bpcl/smartfleet/cardHeaders?fields=DEFAULT&offset=10";
  const data = {
    ...fields,
  };
  const resData = await callGetPrivateAPI(data, urlPath);
  // console.log(resData);
  return resData;
};

// to get card details of individual row
export const getCardDetails = async (fields: any) => {
  // const urlPath = "https://api.mocki.io/v1/bae2b66a";
  const urlPath = "/retail/v2/bpcl/smartfleet/card?fields=DEFAULT";
  const data = {
    id: fields.id,
  };
  const resData = callGetPrivateAPI(data, urlPath);

  return resData;
};

export const postCardDetails = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/card";
  const respData = callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const getCardDropDowns = async (fields: any) => {
  const urlPath = "retail/v2/bpcl/smartfleet/dropDown";
  const respData = callGetPrivateAPI(fields, urlPath);

  return respData;
};

// for submitting card related limits on screen
export const postCardLimit = async (fields: any) => {
  // const urlPath = "https://api.mocki.io/v1/bae2b66a";
  const urlPath = "/retail/v2/bpcl/smartfleet/cardLimit";
  const data = {
    channel: "WEB",
    // bulkEdit: false,
    slNo: fields.offset, //uniqueid
    limitType: fields.limitType, //daily or adhoc
    dailyCardLimit: fields.dailyCardLimit,
    monthlyCardLimit: fields.monthlyCardLimit,
    adhocCardLimit: fields.adhocCardLimit,
    mobileNo: fields.mobileNo,
    allowedFuelTypes: fields.allowedFuelTypes,
  };
  const resData = await callPostPrivateAPI(data, urlPath);

  return resData;
};

export const getCardForBulkAction = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cards/selected";
  const respData = await callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const setPinForCards = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cards/pin";
  const respData = callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const setLimitForCards = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cards/limit";
  const respData = callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const sendOTP = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/otp/send";
  const respData = callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const validateOTP = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/otp/validate";
  const respData = callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const getSelectedCards = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cards/selected";
  const respData = await callPostPrivateAPI(fields, urlPath);

  return respData;
};
export const setBulkLimit = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cards/limit";
  const respData = await callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const postCardStatus = async (fields: any) => {
  // const urlPath = "https://api.mocki.io/v1/bae2b66a";
  const urlPath = "/retail/v2/bpcl/smartfleet/cards/change-status";
  const data = {
    cards: fields.cards,
    changeStatus: fields.changeStatus,
  };
  const resData = await callPostPrivateAPI(data, urlPath);

  return resData;
};

export const setBulkFuelType = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cards/set-fuel-type";
  const respData = await callPostPrivateAPI(fields, urlPath);

  return respData;
};

export const postPopupProfile = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cardProfile";
  const resData = await callPostPrivateAPI(fields, urlPath);
  return resData;
};
