import { callPostPrivateAPI, callGetPrivateAPI, callGetPublicAPI} from "../../index";

export const getAddressData = async (fields: any) => {
    console.log("ghjklkjhghjk");
    const urlPath = "bpclservices/v2/bpcl/addresses?type=ALL";
    const data = {
      ...fields,
    };
    // console.log(data.correspondenceAddressLine1);
    const resData = callGetPrivateAPI(data, urlPath);
    console.log(resData);
  return resData;

};

export const postAddressData = async (fields: any) => {
    // const urlPath = "bpclservices/v2/bpcl/addresses?type=ALL";
    const urlPath = "bpclservices/v2/bpcl/addresses/upsert";
    
      const data = {
        channel: "WEB",   
     
        
          "addresses": [
              {
                  addressType : "CORRESPONDENCE",
                  city: fields.correspondenceAddressCity,                  
                  district : fields.correspondenceAddressDistrict,                                    
                  line1: fields.correspondenceAddressLine1,
                  line2: fields.correspondenceAddressLine2,
                  pincode: fields.correspondenceAddressPincode,
                  state: fields.correspondenceAddressState,
                  id: fields.correspondenceAddressId,
              },
              {
                  addressType : "REGISTERED",
                  line1: fields.registeredAddressLine1,
                  line2: fields.registeredAddressLine2,
                  pincode: fields.registeredAddressPincode,
                  city: fields.registeredAddressCity,
                  district: fields.registeredAddressDistrict,
                  state: fields.registeredAddressState,
                  id: fields.registeredAddressId,
                  
              },
              {
                  addressType: "CARD",
                  city: fields.cardDeliveryAddressCity,
                  district: fields.cardDeliveryAddressDistrict,                  
                  line1: fields.cardDeliveryAddressLine1,
                  line2: fields.cardDeliveryAddressLine2,
                  pincode: fields.cardDeliveryAddressPincode,
                  state: fields.cardDeliveryAddressState,
                  id: fields.cardDeliveryAddressId,
              }
          ]
      }
    
    const resData = await callPostPrivateAPI(data, urlPath);
   

    return resData;
  };
  
  
  export const getPincodeData = async (fields: any) => {
    const urlPath = "/retail/v2/bpcl/data/pincode";
    const data = {
      pincode: fields,
    };
    const resData = callGetPublicAPI(data, urlPath);
    console.log("RESPONSEDATA",resData);
    return resData;
  };
