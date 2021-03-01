import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import styles from "./Signup.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import Link from "next/link";
import { useSelector } from "react-redux";
import { fetchBusinessProgram } from "../../lib/api/signup/signup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  setBusinessProgram,
  setBusiness,
  setLoader,
} from "../../redux/actions/actions";
import { SnackbarMessage } from "src/utility/Snackbar/SnackbarMessages";

const BusinessProgramme = (): JSX.Element => {
  const store: any = useSelector((state) => state);
  const [
    smartFleetApplicationStatus,
    setSmartFleetApplicationStatus,
  ] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  const [status, setstatus] = useState("Registration");
  const saveBusinessprogram = (program: any) => {
    // dispatch(setLoader(true));
    if (program === "smartfleet") {
      dispatch(setBusinessProgram(program));
      router.push("/signup/business");
    }
    // dispatch(setLoader(false));
  };
  const fetchData = async () => {
    const finalData = {
      businessType: store.business,
      customerId: store.customerId,
    };

    // dispatch(setLoader(true));
    console.log("FINAL DATA............", finalData);
    const res: any = await fetchBusinessProgram(finalData);

    if (res?.status === "success") {
      console.log("BUSINESS PROGRAME DETAILS : ", res?.data.landingPageDetails);
      //setBusinessProgramDetails(res.data.landingPageDetails);
      let resData = res.data.landingPageDetails;
      resData.forEach((element: any) => {
        // console.log("This is element..........", element);
        if (element?.businessProgram === "SmartFleet") {
          if (
            element.applicationStatus === "NOT_Registered" ||
            element.applicationStatus === "In_Progress"
          ) {
            setSmartFleetApplicationStatus(false);
            //taking the businesstype from res//
            dispatch(setBusiness(element.businessType));
          } else {
            console.log("set Business Type", element.businessType);
            dispatch(setBusiness(element.businessType));
            setSmartFleetApplicationStatus(true);
          }
          if (element.applicationStatus === "NOT_Registered") {
            setstatus("Registration");
          } else if (element.applicationStatus === "In_Progress") {
            setstatus("Continue To Registration");
          } else if (element.applicationStatus === "Pending") {
            setstatus("Approvals Pending");
          } else if (element.applicationStatus === "Completed") {
            setstatus("Dashboard");
          } else if (element.applicationStatus === "Rejected") {
            setstatus("Rejected");
          }
        }
      });
    } else {
      console.log("ERROR", res?.errors);
      // dispatch(setLoader(false));
      if (res?.errors) {
        res?.errors.forEach((element: any) => {
          console.log(element?.subject);
          if (!element.hasOwnProperty("subject")) {
            console.log(element?.subject);
            // setApiOtherErrorMessage(element?.message);
          } else {
          }
        });
      } else {
        setShowSnackbar(true);
        setSnackbarMessage(SnackbarMessage.API_DOWNTIME);
        setAlertType("error");
      }
    }
  };

  const voidFn = () => {
    return false;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Container
        maxWidth="sm"
        className={`p-0 d-flex flex-column justify-content-between ${styles.businessContainer}`}
      >
        <CustomCard className={`d-flex flex-column ${styles.otpCard}`}>
          <span className={`my-4 ${styles.linkStyle}`}>
            Business Programmes
          </span>
          <div className={`d-flex flex-column `}>
            <span
              className={`my-3 ${styles.linkStyle}`}
              // setSmartFleetApplicationStatus
              onClick={
                !setSmartFleetApplicationStatus
                  ? voidFn
                  : () => saveBusinessprogram("smartfleet")
              }
            >
              <Link href="" data-test-id="smartfleet-programme">
                SmartFleet -
              </Link>
              <span className={`ml-2 ${styles.cursorPointer}`}>
                <span className={`${styles.linkStyleSmallFont}`}>{status}</span>
              </span>
            </span>

            <span
              className={`mb-3 ${styles.linkStyle}`}
              onClick={() => saveBusinessprogram("petrocorp")}
            >
              <Link href="" data-test-id="petrocorp-programme">
                PetroCorp
              </Link>
            </span>
            <span
              className={`mb-3 ${styles.linkStyle}`}
              onClick={() => saveBusinessprogram("i&c")}
            >
              <Link href="" data-test-id="i&C-programme">
                I&C
              </Link>
            </span>
            <span
              className={`mb-3 ${styles.linkStyle}`}
              onClick={() => saveBusinessprogram("lpgCommercial")}
            >
              <Link href="" data-test-id="lpg-commercial-programme">
                LPG Commercial
              </Link>
            </span>
            <span
              className={`mb-3 ${styles.linkStyle}`}
              onClick={() => saveBusinessprogram("lpgIndustrial")}
            >
              <Link href="" data-test-id="lpg-industrial-programme">
                LPG Industrial
              </Link>
            </span>
            <span
              className={`mb-3 ${styles.linkStyle}`}
              onClick={() => saveBusinessprogram("lubes")}
            >
              <Link href="" data-test-id="lubes-programme">
                Lubes Retailer
              </Link>
            </span>
          </div>
        </CustomCard>
      </Container>
    </React.Fragment>
  );
};

export default BusinessProgramme;
