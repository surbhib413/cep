import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {getBusinessInformationData,getBusinessInformationDropdownLists} from "../../src/lib/api/smartfleet/settings/businessinformation"
// import cookies from "next-cookies";
import Cookies from "universal-cookie";
import BusinessInformation from "../../src/pages/Settings/BusinessInformation/BusinessInformation"

interface Props {
  history: any;
  location: any;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = new Cookies(context.req.headers.cookie);
  console.log(
    "within getServerSideProps of SmartfleetRegistrationForm",
    cookies.getAll()
  );
  const queryData = {
    //customerId: cookies(context)?.customerId,
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
  };
  // const response = await getBusinessProfileData(queryData);
  const response = await getBusinessInformationData(queryData);
  console.log("hi...snigdha");
  console.log("response in getServerSideProps", response);
  const dropdownLists = await getBusinessInformationDropdownLists(queryData);
  console.log("dropdownLists in getServerSideProps", dropdownLists);


  return {
    props: { initialData: response.data, dropdownLists: dropdownLists.data}, // will be passed to the page component as props
  };
};
export default function Index(props: any) {
    return (
      <>
        <BusinessInformation {...props} />
      </>
    );
  }
