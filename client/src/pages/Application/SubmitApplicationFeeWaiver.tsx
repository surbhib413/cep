import React from "react";
import { Container, Hidden, Typography, Box } from "@material-ui/core";
import styles from "./Application.module.scss";
import CustomCard from "../../components/CustomCard/CustomCard";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { unsetAssistedFlow } from "../../redux/actions/actions";
import { useRouter } from "next/router";

const downloadIcon = "/Download_Icon.svg";
const requestSentImg = "/Request_Sent.svg";
const requestSentMobileImg = "/Request_Sent_Mobile_Img.svg";

const SubmitApplicationFeeWaiver = (props: { history: any }): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const store: any = useSelector((state) => state);

  const redirectToLandingPage = (): void => {
    // props.history.push("/login/");
    router.push("/business-programme/");
  };

  const redirectToForm = (): void => {
    // props.history.push("/registration/smartfleet/");
    router.push("/registration/smartfleet/");
  };

  const redirectToServiceRequests = () => {
    dispatch(unsetAssistedFlow());
    // props.history.push("/service-requests");
    router.push("/service-requests");
  };

  return (
    <>
      <Hidden smUp>
        <Container
          maxWidth="xl"
          className={`p-0 w-100 d-flex flex-column justify-content-around bd-highlight ${styles.parent}`}
        >
          <CustomCard
            className={`w-100 d-flex flex-column ${styles.submitCard}`}
          >
            <div className="d-flex bd-highlight">
              <div
                className={`w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography className={`pl-2 ${styles.title}`} color="primary">
                  {store.assistedFlow ? "Customer's" : ""} Application Submitted
                </Typography>
              </div>
            </div>
          <div className={`d-flex justify-content-center align-items-center mt-4`}>
            <img
              className="p-3"
              src={requestSentMobileImg}
              alt="requestSentImg"
            /></div>
            <Typography className={`pt-4`}>
              <span className={`${styles.mobileSubLabel} ${styles.bold}`}>
                {store.assistedFlow ? "Customer's" : ""} Application number{" "}
                {store.smartFleetApplicationNumber} has been submitted.
              </span>
            </Typography>
            <Typography className="pt-4">
              <span className={`${styles.mobileSubLabel}`}>
                {store.assistedFlow ? "Customer's" : "Your"} request for Fee
                Waiver has been initiated.{" "}
              </span>
              <p className={`${styles.mobileSubLabel}`}>
                The enrollment would be subject to the Bharat Petroleum's
                approval.{" "}
              </p>
            </Typography>
            <Box
              className={`d-flex flex-column pt-4 mt-auto align-items-center justify-content-center`}
            >
              <CustomButton
                color="primary"
                id="submitfeewaiver-applicationpdf"
                variant="contained"
                className={`w-100`}
                startIcon={<img src={downloadIcon} alt="downloadIcon" />}
              >
                APPLICATION PDF
              </CustomButton>
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitfeewaiver-reviewapplication"
                  variant="outlined"
                  className={`w-100 mt-3`}
                  onClick={() => redirectToForm()}
                >
                  REVIEW APPLICATION
                </CustomButton>
              ) : (
                  <CustomButton
                    color="primary"
                    id="submitfeewaiver-editapplication"
                    variant="outlined"
                    className={`w-100 mt-3`}
                    onClick={() => redirectToForm()}
                  >
                    EDIT APPLICATION
                  </CustomButton>
                )}
              <div
                className={`d-flex align-items-start justify-content-start pt-0`}
              >
                {store.assistedFlow ? (
                  <span
                    className={`mt-3 ${styles.mobileBackToLoginLabel}`}
                    onClick={() => redirectToServiceRequests()}
                    id="submitfeewaiver-servicerequest"
                  >
                    BACK TO SERVICE REQUESTS
                  </span>
                ) : (
                    <span
                      className={`mt-3 ${styles.mobileBackToLoginLabel}`}
                      onClick={() => redirectToLandingPage()}
                      id="submitfeewaiver-signin"
                    >
                      BACK TO LANDING PAGE
                    </span>
                  )}
              </div>
            </Box>
          </CustomCard>
        </Container>
      </Hidden>
      <Hidden xsDown>
        <Container
          maxWidth="xl"
          className={`w-100 d-flex flex-column justify-content-around bd-highlight ${styles.parent}`}
        >
          <CustomCard
            className={`w-100 d-flex flex-column ${styles.submitCard}`}
          >
            <div className={`d-flex justify-content-center align-items-center mt-4`}>
            <img className="p-3" src={requestSentImg} alt="requestSentImg" /></div>
            <div className="d-flex bd-highlight">
              <div
                className={`p-2 w-100 align-items-center justify-content-center bd-highlight`}
              >
                <Typography className={`pl-2 ${styles.title}`} color="primary">
                  {store.assistedFlow ? "Customer's" : ""} Application Submitted
                </Typography>
              </div>
            </div>
            <Typography className={`pt-5`}>
              <span className={`${styles.subLabel}`}>
                {store.assistedFlow ? "Customer's" : ""} Application number{" "}
                {store.smartFleetApplicationNumber} has been submitted.
              </span>
            </Typography>
            <Typography className="pt-4">
              <span className={`${styles.subSpanLabel}`}>
                {store.assistedFlow ? "Customer's" : "Your"} request for Fee
                Waiver has been initiated.{" "}
              </span>
              <p className={`${styles.subSpanLabel}`}>
                The enrollment would be subject to the Bharat Petroleum's
                approval.{" "}
              </p>
            </Typography>
            <Box
              className={`d-flex w-100 pt-4 mt-auto align-items-end ${styles.submitBox}`}
            >
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitfeewaiver-servicerequest"
                  variant="outlined"
                  className={`ml-4 mr-auto`}
                  onClick={() => redirectToServiceRequests()}
                >
                  BACK TO SERVICE REQUESTS
                </CustomButton>
              ) : (
                  <CustomButton
                    color="primary"
                    id="submitfeewaiver-signin"
                    variant="outlined"
                    className={`ml-4 mr-auto`}
                    onClick={() => redirectToLandingPage()}
                  >
                    BACK TO LANDING PAGE
                  </CustomButton>
                )}
              {store.assistedFlow ? (
                <CustomButton
                  color="primary"
                  id="submitfeewaiver-reviewapplication"
                  variant="outlined"
                  className={`mr-4 ${styles.btnStyle}`}
                  onClick={() => redirectToForm()}
                >
                  REVIEW APPLICATION
                </CustomButton>
              ) : (
                  <CustomButton
                    color="primary"
                    id="submitfeewaiver-editapplication"
                    variant="outlined"
                    className={`mr-4 ${styles.btnStyle}`}
                    onClick={() => redirectToForm()}
                  >
                    EDIT APPLICATION
                  </CustomButton>
                )}
              <CustomButton
                color="primary"
                id="submitfeewaiver-applicationpdf"
                variant="contained"
                className={`mr-4 ${styles.btnEditStyle}`}
                startIcon={<img src={downloadIcon} alt="downloadIcon" />}
              >
                APPLICATION PDF
              </CustomButton>
            </Box>
          </CustomCard>
        </Container>
      </Hidden>
    </>
  );
};

export default SubmitApplicationFeeWaiver;
