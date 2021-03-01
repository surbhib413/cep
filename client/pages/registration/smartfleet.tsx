import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  getSmartFleetData,
  getDropdownLists,
} from "../../src/lib/api/smartfleet/smartfleet";
import Cookies from "universal-cookie";
import SmartfleetRegistrationForm from "../../src/pages/SmartfleetRegistrationForm/SmartfleetRegistrationForm";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = new Cookies(context.req.headers.cookie);
  console.log(
    "within getServerSideProps of SmartfleetRegistrationForm : cookies.getAll",
    cookies.getAll()
  );
  const queryData = {
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
  };
  const response = await getSmartFleetData(queryData);
  console.log("response in getServerSideProps", response);
  const dropdownLists = await getDropdownLists(queryData);
  console.log("dropdownLists in getServerSideProps", dropdownLists);
  return {
    props: {
      response: response || {},
      dropdownLists: dropdownLists?.data || {},
    }, // will be passed to the page component as props
  };
};

export default function Index(props: any) {
  return (
    <>
      <SmartfleetRegistrationForm {...props} />
    </>
  );
}
