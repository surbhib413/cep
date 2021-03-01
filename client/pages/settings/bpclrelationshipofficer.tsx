import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  getRelationshipOfficerdata,
  
} from "../../src/lib/api/smartfleet/settings/bpclrelationshipofficer";

import cookies from "next-cookies";
import BPCLRelationshipOfficer from "../../src/pages/Settings/BPCL_RelationshipOfficer/Relationship_officer";

interface Props {
  history: any;
  location: any;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // const data = { name: "Bhavin", customerId: cookies(context) };
  console.log(
    "within getServerSideProps of BPCLRelationship Officer",
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
  const response = await getRelationshipOfficerdata(queryData);
  console.log(response,"succcccccccccccess")

  // const response = {

  //     name: "Adam Scott",
  //     mobilenumber: "9829998299",
  //     emailid: "adamscott@email.com",
     
  // }

  return {
    props: { initialData: response.data},
     // will be passed to the page component as props
  };
};


export default function Index(props: any) {
  return (
    <>
      <BPCLRelationshipOfficer {...props}  />
    </>
  );
}
