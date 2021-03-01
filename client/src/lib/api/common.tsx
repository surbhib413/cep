import { callGetPrivateAPI } from ".";

export const callDropdownList = async (fields: any) => {
    const urlPath = "/retail/v2/bpcl/smartfleet/dropDown";
    const resData = callGetPrivateAPI(fields, urlPath);
    return resData;
  };