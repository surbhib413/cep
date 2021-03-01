import { callGetPrivateAPI, callGetPublicAPI } from "../index";

export const getRoLocatorFilterData = async (fields: any) => {
  const urlPath = "/retail/v2/bpcl/smartfleet/dropDown?code=TopFilter&code=Amenities&code=FuelStationCategory&code=FuelType&code=LessAmenities";
  const data = {
    ...fields
  };
  const resData = callGetPrivateAPI(data, urlPath);
  return resData;
};

export const getRoLocatorDetailData = async (fields: any) => {
  const { roId } = fields;
  const urlPath = `/retail/v2/bpcl/retail/rolocator/details`;
  const data = {
    ...fields
  };
  const resData = callGetPublicAPI(data, urlPath);
  return resData;
};


