import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import ROLocator from '../../src/pages/ROLocator/ROLocator';
import { getRoLocatorFilterData } from "../../src/lib/api/roLocator/roLocator";
import Cookies from "universal-cookie";

interface Props {
  history: any;
}

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

  const response = await getRoLocatorFilterData(queryData);
  console.log('This response for ROLocator Filter --------------------------')
  console.log(response);

  return {
    props: { response: response }
    // props: { response: null }
  };
};

export default function Index(props: Props) {
  return (
    <>
      <ROLocator {...props} />
    </>
  );
}
