import { callGetPrivateAPI, callPostPublicAPI, callPostPrivateAPI } from "../../index";

//Send OTP from RedeemBalance Dialog to OTP
export const getSendOTPRewards = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/rewards/sendOtp";
  const data = {
    otpChannel: "MOBILE" //Confirmed with Eknath, this is sent only for mobile
  };
  const resData = await callGetPrivateAPI(data, urlPath);
  return resData;
};

//Resend OTP from OTP(redirectedFrom === "petromilesRewardBalance") to OTP
export const getResendOTPRewards = async (fields: any) => {
  const urlPath = "retail/v2/bpcl/smartfleet/rewards/resendOtp/?otpChannel=MOBILE";
  //Confirmed with Eknath, this is sent only for mobile
  const data = {};
  const resData = await callGetPrivateAPI(data, urlPath);
  return resData;
};

//Validate OTP from OTP(redirectedFrom === "petromilesRewardBalance")
export const postValidateOTPRewards = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/otp/validate";
  const data = {
    channel: fields.channel,
    isNotificationEnabled: fields.isNotificationEnabled,
    otpChannel: fields.otpChannel,
    otpType: fields.otpType,
    otp: fields.otp,
  };
  // const resData = await callPostPublicAPI(data, urlPath);
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

//Validate OTP success to redeem the petromiles
export const postRedeemPetromiles = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/rewards/redeempetromiles";
  const data = {
    ...fields,
  }
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
}