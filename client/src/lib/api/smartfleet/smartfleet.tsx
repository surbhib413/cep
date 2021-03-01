import {
  callPostPrivateAPI,
  callGetPublicAPI,
  callGetPrivateAPI,
  callPostPrivateFileUploadAPI,
} from "../index";
import { now } from "moment";

export const getSmartFleetData = async (fields: any = {}) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/smartFleetDetails";
  const data = {
    ...fields,
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const postBasicProfile = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/basicProfile";
  const data = {
    organizationName: fields.primaryUserOrganizationName, //? fields.primaryUserOrganizationName : "qwe",
    primaryUserName: fields.primaryUserName,
    primaryUserDesignation: fields.primaryUserDesignation,
    primaryUserMobileNumber: fields.primaryUserMobileNumber,
    primaryUserEmail: fields.primaryUserEmail,
    authSignatoryName: fields.authSignatoryName,
    authSignatoryDesignation: fields.authSignatoryDesignation,
    authSignatoryMobileNumber: fields.authSignatoryMobileNumber,
    authSignatoryEmail: fields.authSignatoryEmail,
    authSameAsPrimary: fields.signatorySameAsPrimaryUser,
    receiverName: fields.receiverName,
    receiverDesignation: fields.receiverDesignation,
    receiverMobileNumber: fields.receiverMobileNumber,
    receiverEmail: fields.receiverEmail,
    receiverSameAsPrimary: fields.receiverSameAsPrimaryUser,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const postAddressDetails = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/addressDetails";
  const data = {
    ...fields,
    cardDelSameAsCorres: fields.cardDeliverySameAsCorrespondenceAddress,
    corresSameAsReg: fields.correspondenceSameAsRegisteredAddress,
  };
  const resData = callPostPrivateAPI(data, urlPath);
  return resData;
};

export const getPincodeData = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/data/pincode";
  const data = {
    pincode: fields,
  };
  const resData = callGetPublicAPI(data, urlPath);
  return resData;
};

export const postKYCDetails = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/uploadKYCDocuments";
  const data = {
    ...fields,
    identityDocument: fields.identityDocument,
    poaDocument: fields.poaDocument,
    customerType: fields.customerType,
    idNumber: fields.businessPanNumber,
    proofOfIdentityType: fields.identityProofType
      ? fields.identityProofType
      : "PAN",
    proofOfAddressType: fields.addressProofType
      ? fields.addressProofType
      : "AADHAR",
    gstin: fields.gstinNumber,
    //businessPanNumber: fields.businessPanNumber,
  };
  const resData = callPostPrivateAPI(data, urlPath);
  return resData;
};

export const postSmartFleetForm = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/submit";

  const resData = await callPostPrivateAPI(fields, urlPath);
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
export const getDropdownLists = async (fields: any = {}) => {
  const urlPath = "/retail/v2/bpcl/data/dropdownOptions";

  const resData = callGetPrivateAPI(fields, urlPath);
  return resData;
};

export const postFleetAccountAvailability = async (fields: any) => {
  const urlPath =
    "/retail/v2/bpcl/smartfleet/register/fleetAccountAvailability";
  const data = {
    fleetAccountId: fields.newFAId,
    isCustom: fields.isCustom,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const postFleetAccount = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/createFleetAccount";
  const data = {
    fleetAccountId: fields.fullFAId,
    isCustom: fields.isCustom,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const postFleetAccountReset = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/resetFA";
  const data = {
    fleetAccountId: fields.fullFAId,
    isCustom: fields.isCustom,
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};

export const postPayment = async (fields: any) => {
  const urlPath =
    "/retail/v2/bpcl/smartfleet/register/savePayment?fields=DEFAULT";
  const data = {
    ...fields,
  };
  const resData = callPostPrivateAPI(data, urlPath);
  /*const resData = {

    
    "message": "Fee Waiver Request Created Successfully. ",
    "status": "success",
    "statusCode": 201,
    "updatedAt": "Tue Dec 08 12:59:09 IST 2020"
  };*/

  return resData;
};

export const getFees = async (fields: any) => {
  const urlPath =
    "/retail/v2/bpcl/smartfleet/register/getPaymentFees?fields=DEFAULT";
  const data = {
    ...fields,
  };
  const resData = callPostPrivateAPI(data, urlPath);
  /*const resData = {

    "message": "Payment inputs ",
    "status": "success",
    "statusCode": 200,
    "updatedAt": "Tue Dec 08 12:59:09 IST 2020",
    "feesToPay":"200.00"
  };*/

  return resData;
};

export const postKYCDetail = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/register/uploadKYCDocuments";
  const resData = await callPostPrivateFileUploadAPI(fields, urlPath);
  return resData;
};



export const getDropdown = async (fields: any = {}) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/dropDown";
  const data = {
   ...fields
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const postPopupProfile = async (fields: any) => {
  const urlPath =
    "/retail/v2/bpcl/smartfleet/cardProfile";
  const data = {
    channel: "WEB",
    // id: fields.fleetCardID,
    // customCardNumber: fields.customCardNumber,
    // cardPersonalization: fields.cardPersonalization,
    // allowedFuelTypes :"SPEED",
    // registrationYear: fields.registrationYear,
    // vehicleMake: fields.vehicleMake,
    // vehicleType: fields.vehicleType,
    // vehicleNumber: fields.vehicleNumber,
    bulkupload: false,
    ...fields
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  return resData;
};