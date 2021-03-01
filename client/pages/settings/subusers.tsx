import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSubUsersData } from "../../src/lib/api/smartfleet/settings/subusers";
// import cookies from "next-cookies";
import Cookies from "universal-cookie";
import SubUsers from "../../src/pages/Settings/SubUsers/SubUsers";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {

  const cookies = new Cookies(context.req.headers.cookie);
  console.log(
    "within getServerSideProps : cookies.getAll",
    cookies.getAll()
  );
  const queryData = {
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
  };

  const response = await getSubUsersData(queryData);
  console.log('Hey --------------------------------')
  console.log(response);
  return {
    props: { response: response }
    // props: { response: null }
  };
};

export default function Index(props: any) {
  return (
    <>
      <SubUsers {...props} />
    </>
  );
}
