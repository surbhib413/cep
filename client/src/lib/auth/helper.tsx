import Cookies from "universal-cookie";
import { postSignout } from "../api/signin/signin";

export const isUserAuthunticated = () => {
  const cookies = new Cookies();
  const access_token: any = cookies.get("mark_one");
  const server_token: any = cookies.get("mark_two");
  const refresh_token: any = cookies.get("mark_three");
  const customerId: any = cookies.get("customerId");
  const localValues = JSON.parse(localStorage.getItem("persist:root") || "{}");
  console.log(localValues);

  const localCustID = localValues?.customerId
    ? localValues?.customerId.slice(1, -1)
    : "";
  //   console.log("mark_one", access_token);
  //   console.log("mark_two", server_token);
  //   console.log("mark_three", refresh_token);
  //   console.log("customer_ID", customerId);
  //   console.log("localCustID", localCustID);
  if (
    customerId !== "" &&
    customerId !== undefined &&
    localCustID !== "" &&
    localCustID === customerId &&
    access_token !== "" &&
    access_token !== undefined &&
    refresh_token !== "" &&
    refresh_token !== undefined &&
    server_token !== "" &&
    server_token !== undefined
  ) {
    console.log("authuntication true");
    return true;
  } else {
    console.log("authuntication false");
    return false;
  }
};

export const callSignOut = async () => {
  const cookies = new Cookies();
  const res: any = await postSignout();
  console.log("Signout", res);
  if (res?.status === "success") {
    cookies.remove("mark_one");
    cookies.remove("mark_two");
    cookies.remove("mark_three");
    cookies.remove("customerId");
    localStorage.clear();
    window.location.href = "/login";
    console.log("Signout successfully.");
    return true;
  } else {
      console.log("Something went wrong.");
      return false; 
  }
};
