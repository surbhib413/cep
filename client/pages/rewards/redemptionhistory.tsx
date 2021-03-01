import { GetServerSideProps, GetServerSidePropsContext } from "next";
// import { getMyProfileData } from "../../src/lib/api/smartfleet/settings/myprofile";
import {getRedemptionHistoryData} from "../../src/lib/api/smartfleet/rewards/redemptionhistory";
//import {getRedemptionHistoryQuarterlyData} from "../../src/lib/api/smartfleet/rewards/redemptionhistory";
import Cookies from "universal-cookie";
import RedemptionHistory from "../../src/pages/Rewards/RedemptionHistory/RedemptionHistory";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {

  const cookies = new Cookies(context.req.headers.cookie);
  const queryData = {
    // requestData:{
    //   // currentPage:0,
    //   // fields:"DEFAULT",
    //   // pageSize:10,
    // searchType:"month",
    //   // sort:"asc"
    // },
    currentPage:0,
    searchType:"month",
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
  };

  const response = await getRedemptionHistoryData(queryData);
  console.log("hi snigdha");
  console.log("response in server side Redemption History ", response);
  
  // const response_quarter = await getRedemptionHistoryQuarterlyData(queryData);
  // console.log("hi snigdha");
  // console.log("response in server side Redemption History ", response_quarter);

  return {
    // props: { response: response }
    props: { initialData: response.data }
  };
};

export default function Index(props: any) {
  return (
    <>
      <RedemptionHistory {...props} />
    </>
  );
}
