import { callPostPrivateAPI, callGetPrivateAPI} from "../../index";


export const getAuthorisedSignatureData = async (fields: any) => {
  const urlPath = "retail/v2/bpcl/smartfleet/authSignDetails?fields=DEFAULT";
  const data = {
    ...fields,
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};


export const postAuthorisedSignature = async (fields: any) => {
  const urlPath = "retail/v2/bpcl/smartfleet/authSignDetails?fields=DEFAULT";
  const data = {
    name: fields.name,
    designation: fields.designation,
    mobile: fields.mobile,
    email: fields.email
  };
  const resData = await callPostPrivateAPI(data, urlPath);
  // return {
  //     status: "success",
  //     message: "",
  //     data: "",
  // }
  return resData;
};


