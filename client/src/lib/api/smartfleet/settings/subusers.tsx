import { callPostPrivateAPI, callGetPrivateAPI, callDeletePrivateAPI } from "../../index";

export const getSubUsersData = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/subUser?Roles=sub_user";
  const data = {
    ...fields
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const getSubUserById = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/subuserid?id=" + fields.userId;
  const data = {
    ...fields
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const upsertSubUser = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/subUser";
  const data = {
    "bpclSubUserList": [
      {
        name: fields.name,
        designation: fields.designation,
        mobileNumber: fields.mobileNumber,
        whatsAppNumber: fields.whatsAppNumber,
        emailId: fields.emailId,
        thumbnailUrl: fields.thumbnailUrl,
        userId: fields.emailId,
        cardDetails: null,
        active: fields.active
      }
    ]
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const disableSubUser = async (userId: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/users?id=" + userId;
  const data = {};
  const resData = await callDeletePrivateAPI(data, urlPath);
  return resData;
};

export const enableSubUser = async (userId: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/enableSubUser?id=" + userId;
  const data = {};
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const deleteSubUser = async (userId: any) => {
  // const urlPath = "/retail/v2/bpcl/smartfleet/users?id=" + userId;
  // const data = {};
  // const resData = await callDeletePrivateAPI(data, urlPath);
  // return resData;
};