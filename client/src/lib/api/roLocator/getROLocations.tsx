
//import {callGetPublicAPI} from '../index';
import { callGetPrivateAPI } from "../index";
export const getROLocations = async (latitude: number,longitude: number, filters: string) => {
    
    const urlPath = "/retail/v2/bpcl/retail/rolocators?latitude="+latitude+"&longitude="+longitude + filters;
    
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