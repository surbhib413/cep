import { callGetPrivateAPI } from "../index";
export const getFuelStationBetweenPointAandB = async (slatitude: number,slongitude: number, tlatitude: number,tlongitude: number) => {
    
    //const urlPath = "/retail/v2/bpcl/retail/rolocators?latitude="+latitude+"&longitude="+longitude + filters;

    const urlPath = "/retail/v2/bpcl/retail/rolocator/route?accuracy=0&currentPage=0&pageSize=20&radius=2000&slatitude="+slatitude+"&slongitude="+slongitude+"&sort=asc&tlatitude="+tlatitude+"&tlongitude="+tlongitude
    
    const data = {
     cookieData : null
    };
    
    const resDataa = await callGetPrivateAPI(data, urlPath);
    if(resDataa.status === "failure") {
        return( {
            pointOfServices:[]
        });
    } else {
        return resDataa.data;
    }
    
  //return resDataa.data;
  
};