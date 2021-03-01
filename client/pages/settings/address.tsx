import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  getAddressData,
  // getPincodeData,
} from "../../src/lib/api/smartfleet/settings/address";
import Cookies from "universal-cookie";
import Address from "../../src/pages/Settings/Address/Address";


// interface Props {
//   history: any;
//   location: any;
// }

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = new Cookies(context.req.headers.cookie);
  // const data = { name: "Bhavin", customerId: cookies(context) };
  console.log(
    "within getServerSideProps of Address",
    cookies.getAll()
  );
  // const queryData = {
  //   customerId: cookies(context)?.customerId,
  //   cookieData: {
  //     mark_one: cookies(context)?.mark_one,
  //     mark_two: cookies(context)?.mark_two,
  //     mark_three: cookies(context)?.mark_three,
  //   },
  // };
  const queryData = {
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
  };
  const response = await getAddressData(queryData);
  console.log("response in getServerSideProps", response);
  // const pincodeData = await getPincodeData(queryData);
  // console.log("pincodeData in getServerSideProps", pincodeData);
  // console.log(response, "hello sushma")


  return {
    props: { initialData: response.data}, // will be passed to the page component as props
  };
};
// getPincodeData: pincodeData.data
export default function Index(props: any) {
  return (
    <>
      <Address {...props} />
    </>
  );
}


