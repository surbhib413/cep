import { callGetPrivateAPI, callPostPrivateAPI, callPostPrivateFileUploadAPI, callDeletePrivateAPI } from "../../index";

export const getMyProfileData = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/user";
  const data = {
    ...fields
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const uploadProfileImage = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/user/image";
  const resData = await callPostPrivateFileUploadAPI(fields, urlPath);
  return resData;
};

export const removeProfileImage = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/user/image?id=" + fields.userId;
  const data = {};
  const resData = await callDeletePrivateAPI(data, urlPath);
  return resData;
};

export const updateUserDetails = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/user";
  const data = {
    channel: "WEB",
    customerId: fields.customerId,
    name: fields.name,
    designation: fields.designation,
    mobileNumber: fields.mobileNumber,
    whatsAppNumber: fields.whatsAppNumber,
    emailId: fields.emailId,
    thumbnailUrl: fields.thumbnailUrl,
    userId: fields.userId
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const changeUserPassword = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/changePassword?fields=DEFAULT";
  const data = {
    oldPassword: fields.oldPassword,
    newPassword: fields.newPassword,
    confNewPassword: fields.confirmPassword
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};