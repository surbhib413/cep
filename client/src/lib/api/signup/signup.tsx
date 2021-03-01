import {
  callPostPublicAPI,
  callPostPrivateAPI,
  callPostPublicAuthorizationServer,
} from "../index";
// callPostOtpVerification
export const postSignUp = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/signUp";
  const data = {
    isNotificationEnabled: fields.isNotificationEnabled,
    otpChannel: fields.otpChannel,
    otpType: fields.otpType,
    customerId: fields.customerId,
    whatsappNumber: fields.whatsappNumber,
    customerType: fields.customerType,
  };
  const resData = await callPostPublicAPI(data, urlPath);
  return resData;
};

export const authorizationServer = async () => {
  const urlPath = "/authorizationserver/oauth/token";
  const resData = await callPostPublicAuthorizationServer(urlPath);
  return resData;
};

export const postVerifyOTP = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/verifyOTP";
  const data = {
    customerId: fields.customerId,
    otp: fields.otp,
    otpType: fields.otpType,
    otpChannel: fields.otpChannel,
    customerType: fields.customerType,
  };
  const resData = await callPostPublicAPI(data, urlPath);
  // const resData = await callPostOtpVerification(data, urlPath);
  return resData;
};

export const postResendOTP = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/resendOTP";
  const data = {
    customerId: fields.customerId,
    otpType: fields.otpType,
    otpChannel: fields.otpChannel,
  };
  const resData = await callPostPublicAPI(data, urlPath);
  return resData;
};

export const postBusinessProgramme = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/businessProgram";
  const data = {
    customerId: fields.customerId,
    businessProgram: fields.businessProgram,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const postBusinessType = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/account/selection";
  const data = {
    businessProgram: fields.businessProgram,
    businessType: fields.customerType,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const fetchBusinessProgram = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/account/landingPageDetails";
  const data = {
    customerId: fields.customerId,
    businessType: fields.businessType,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};
