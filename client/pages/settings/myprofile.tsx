import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getMyProfileData } from "../../src/lib/api/smartfleet/settings/myprofile";
// import cookies from "next-cookies";
import Cookies from "universal-cookie";
import MyProfile from "../../src/pages/Settings/MyProfile/MyProfile";

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

  const response = await getMyProfileData(queryData);
  console.log('Heloo Abhi--------------------------')
  console.log(response);

  return {
    props: { response: response }
    // props: { response: null }
  };
};

export default function Index(props: any) {
  return (
    <>
      <MyProfile {...props} />
    </>
  );
}
