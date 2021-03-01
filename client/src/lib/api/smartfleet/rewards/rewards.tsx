import { callGetPrivateAPI, callPostPrivateAPI, callPostPrivateFileUploadAPI, callDeletePrivateAPI } from "../../index";

export const getRewardsData = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/rewards";
  const data = {
    ...fields
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const getFaqs = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/rewards/faq";
  const data = {
    ...fields
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};