import { callPostPublicAPI, callPostPublicAuthorizationServer, callPostPublicPasswordVerify, callPostPrivateAPI, } from "../index";

export const authorizationServer = async () => {
  const urlPath = "/authorizationserver/oauth/token";
  const resData = await callPostPublicAuthorizationServer(urlPath);
  return resData;
};

export const postVerifyUser = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/signIn";
  const data = {
    customerId: fields.customerId,
    status: fields.status,
    otpChannel: fields.otpChannel,
    otpType: fields.otpType
  };
  const resData = await callPostPublicAPI(data, urlPath);
  return resData;
};

export const postLoginVerifyUser = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/verifyUser";
  const data = {
    customerId: fields.customerId,
  };
  //const resData = await callVerifyAPI(data, urlPath);
  const resData = await callPostPublicAPI(data, urlPath);
  return resData;
};


export const postVerifyPassword = async (fields: any) => {
  const urlPath = "/authorizationserver/oauth/token";
  const data = {
    customerId: fields.customerId,
    password: fields.password,
  };
  console.log('SIGNIN.tsx req obj', data);
  const resData = await callPostPublicPasswordVerify(data, urlPath);
  return resData;
};

export const postSetResetPassword = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/resetPassword";
  const data = {
    customerId: fields.customerId,
    secureString: fields.password
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const postSignout = async () => {
  const urlPath = "/bpclservices/v2/bpcl/user/logout";
  const data = {
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};






