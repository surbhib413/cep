import { callGetPrivateAPI, callPostPrivateAPI } from "../../index";

export const getBusinessInformationData = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/businessInfo";
  const data = {
    ...fields,
    // customerId: fields.customerId, //? fields.customerId : now(),
    // customerId: fields.customerId ? fields.customerId : "nekkanti@deloitte.com",
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const getBusinessInformationDropdownLists = async (fields: any = {}) => {
  // const urlPath = "/retail/v2/bpcl/smartfleet/cardDropDown?code=BusinessType,FuelRequierment";
  const urlPath = "/retail/v2/bpcl/smartfleet/dropDown?code=BusinessType,FuelRequierment";

  const resData = callGetPrivateAPI(fields, urlPath);
  return resData;
};

export const postBusinessInformation = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/businessInformation";
  const data = {
    areasOfOperations: {
      interState: fields.interState,
      withinCity: fields.withinCity,
      withinState: fields.withinState,
    },
    businessType: fields.businessType,
    channel: fields.channel,
    customerId: fields.customerId,
    customerType: fields.customerType,
    estimatedMonthlyFuel: fields.estimatedMonthlyFuel,
    from: fields.operationalRouteFrom,
    industryType: fields.industryType,
    loyaltyAccounts: {
      hpcl: fields.hpcl,
      iocl: fields.iocl,
      otherLoyaltyAccounts: fields.otherLoyaltyAccounts,
      others: fields.others,
      reliance: fields.reliance,
    },
    otherIndustryType: fields.otherIndustryType,
    to: fields.operationalRouteTo,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};