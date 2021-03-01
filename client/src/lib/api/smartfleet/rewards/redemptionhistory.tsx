import { request } from "http";
import { callGetPrivateAPI, callPostPrivateAPI } from "../../index";

export const getRedemptionHistoryData = async (fields: any) => {
  console.log("search type value without reqdata", fields.searchType);
  console.log("request data", fields.requestData);

 
  console.log("field values", fields);
  const urlPath=`retail/v2/bpcl/smartfleet/rewards/redemptionHistory?currentPage=${fields.currentPage}&fields=DEFAULT&pageSize=10&searchType=${fields.searchType}&sort=asc`;
  delete fields.searchType;
    const data = {
      ...fields,
      // customerId: fields.customerId, //? fields.customerId : now(),
      // customerId: fields.customerId ? fields.customerId : "nekkanti@deloitte.com",
    };
    const resData = callGetPrivateAPI(data, urlPath);
    return resData;
  };
  
  export const getRedemptionDateRange = async (fields: any) => {
    console.log(fields,"apiiiiii")
    const urlPath = `/retail/v2/bpcl/smartfleet/rewards/redemptionHistory?currentPage=0&fields=DEFAULT&pageSize=10&searchType=null&sort=asc&startDate=${fields.startDate}&endDate=${fields.endDate}`;
    delete fields.startDate;
    delete fields.endDate;
    const data = {
      ...fields,
      
    };
    
    const resData = callGetPrivateAPI(data, urlPath);
    return resData;
  };