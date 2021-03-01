import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getRewardsData, getFaqs } from "../../src/lib/api/smartfleet/rewards/rewards";
import Cookies from "universal-cookie";
import Rewards from "../../src/pages/Rewards/Rewards/Rewards";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {

  const cookies = new Cookies(context.req.headers.cookie);
  const queryData = {
    cookieData: {
      mark_one: cookies.get("mark_one"),
      mark_two: cookies.get("mark_two"),
      mark_three: cookies.get("mark_three"),
    },
  };

  const rewardsData = await getRewardsData(queryData);
  const faqs = await getFaqs(queryData);
  console.log(rewardsData);
  console.log(faqs);

  return {
    props: { response: { initialRewardsData: rewardsData.data || null, initialFaqs: faqs.data || null } || null }
  };
};

export default function Index(props: any) {
  return (
    <>
      <Rewards {...props} />
    </>
  );
}