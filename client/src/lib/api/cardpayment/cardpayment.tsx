import { fileURLToPath } from "url";
import {  callPostPrivateAPI, callGetPrivateAPI } from "../index";


/** Get Application Summary */
export const getApplicationDetails = async (fields: any) => {
    const urlPath = "/retail/v2/bpcl/samrtfleet/cardPayment/details";
    const data = {
      ...fields
    };
    const resData = callGetPrivateAPI(data, urlPath);
     return resData;
};

/** Check and GET Pincode Data */
export const getPincodeData = async (pincode: any) => {
  const urlPath = "/retail/v2/bpcl/data/pincode";
  const data = { pincode };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

/** Get Card Delivery Address */
export const getAddresses = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/data/addresses";
  const data = { ...fields };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
 };

/** Post Card Delivery */
export const postCardDeliveryAddress = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/samrtfleet/cardPayment/updateAddress";
  const data = {
    ...fields
  };
  const resData = callPostPrivateAPI(data, urlPath);
  return resData;
};

/** Verify OTP */
export const postVerifyOTP = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/verifyOTP";
  const data = {
    customerId: fields.customerId,
    otp: fields.otp,
    otpType: fields.otpType,
    otpChannel: fields.otpChannel,
    customerType: fields.customerType
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

/** Sent OTP */
export const postResendOTP = async (fields: any) => {
  const urlPath = "/bpclservices/v2/bpcl/user/resendOTP";
  const data = {...fields};
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

/** POST Request Fee Waiver and Paid at Fuel station */
export const postRequestPaymentOption = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/cardsOrder/pay";
  const data = {
    // customerId: fields.customerId,
    // "channel": "Web",
    // "customerType": "Company",
    // "feesToPay": fields.feesToPay,
    // "paymentType": "FEE_WAIVER",
    // "reasonForRequest": fields.reasonForRequest,
    // "referenceNumber":null
    ...fields
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};
