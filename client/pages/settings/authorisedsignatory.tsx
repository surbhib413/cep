import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getAuthorisedSignatureData } from "../../src/lib/api/smartfleet/settings/authorisedsignatory" ;
import cookies from "next-cookies";
import AuthorisedSignatory from "../../src/pages/Settings/AuthorisedSignatory/AuthorisedSignatory";

interface Props {
  history: any;
  location: any;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // const data = { name: "Bhavin", customerId: cookies(context) };
  console.log(
    "within getServerSideProps of Authorised Signature",
    cookies(context)
  );
  
  const queryData = {
    customerId: cookies(context)?.customerId,
    cookieData: {
      mark_one: cookies(context)?.mark_one,
      mark_two: cookies(context)?.mark_two,
      mark_three: cookies(context)?.mark_three,
    },
  };
  const response = await getAuthorisedSignatureData(queryData);
 

  return {
    props: { initialData: response.data }, // will be passed to the page component as props
  };
};

export default function Index(props: any) {
  return (
    <>
      <AuthorisedSignatory {...props} />
    </>
  );
}
