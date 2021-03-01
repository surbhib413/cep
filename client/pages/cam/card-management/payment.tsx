import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Cookies from "universal-cookie";
import { getApplicationDetails, getAddresses } from '../../../src/lib/api/smartfleet/cardpayment'
import Payment from "../../../src/pages/CAMCardManagement/Payment/Payment";

interface Props {
  history: any;
  location: any;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = new Cookies(context.req.headers.cookie);
  console.log(
    "within getServerSideProps of Card Payment",
    cookies.getAll()
  );
  const queryData = {
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
  };
  const response = await getApplicationDetails(queryData);
  const responseAddress = await getAddresses(queryData)
  console.log('APPLICATION DETAILS',response);
  console.log('ADDRESS DETAILS',responseAddress);
  return {
    //Reason for adding JSON parse and stringify: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
    props: {
      response: JSON.parse(JSON.stringify(response)),
      responseAddress: JSON.parse(JSON.stringify(responseAddress))
    } 
  };
};

export default function Index(props: Props) {
  return (
    <>
      <Payment {...props} />
    </>
  );
}
