import PopupCardProfile from "../../src/pages/SFCardManagement/CardProfile";

  import { GetServerSideProps, GetServerSidePropsContext } from "next";
  import Cookies from "universal-cookie";
  import { callDropdownList } from "../../src/lib/api/common";

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
      code: "VehicleType,VehicleMake,FuelType,CardName,CardType",
    };
    const dropdownLists = await callDropdownList(queryData);
    console.log("dropdownLists in getServerSideProps", dropdownLists);
    return {
      props: { dropdownLists: dropdownLists.data }, // will be passed to the page component as props
    };
  };
  
  
  export default function Index(props: any) {
    return (
      <>
      {/* <SideNav></SideNav> */}
        <PopupCardProfile {...props} />
      </>
    );
  }