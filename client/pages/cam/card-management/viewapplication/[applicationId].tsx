import ViewApplication from "../../../../src/pages/CAMCardManagement/ViewApplication/ViewApplication";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Cookies from "universal-cookie";
import { useRouter } from 'next/router';
import { getApplicationDetails, getAddresses } from '../../../../src/lib/api/smartfleet/cardpayment'

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
  

const applicationID = context?.query?.applicationId || '';
  // console.log("Props Print", applicationID);
  
  const queryData = {
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
    applicationNumber: applicationID
    
  };
 
  const applicationResponse = await getApplicationDetails(queryData);
  const addressResponse = await getAddresses(queryData);
  console.log('Get Application Details',applicationResponse)
  
  return {
    //Reason for adding JSON parse and stringify: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
    props: {
      applicationResponse: JSON.parse(JSON.stringify(applicationResponse)),
      addressResponse: JSON.parse(JSON.stringify(addressResponse)),
    } // will be passed to the page component as props
  };
};

export default function Index(props: Props) {
  return (
    <>
      <ViewApplication {...props} />
    </>
  );
}