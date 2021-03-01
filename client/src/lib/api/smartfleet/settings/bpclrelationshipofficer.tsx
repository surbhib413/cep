import { callPostPrivateAPI, callGetPrivateAPI }  from "../../index";

export const getRelationshipOfficerdata = async (fields: any) => {
    const urlPath = "retail/v2/bpcl/smartfleet/relationshipofficer";
    const data = {
      ...fields
    };
    console.log(data.name, "hiiiiiiiiiiiiiiiiiiiiiiiii");
    const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};