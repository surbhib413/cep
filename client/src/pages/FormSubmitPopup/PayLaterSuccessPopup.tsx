import React, { useEffect } from "react";
import styles from "./FormSubmitPopup.module.scss";
import Container from "@material-ui/core/Container";
import CustomCard from "../../components/CustomCard/CustomCard";
import { Typography, Button } from "@material-ui/core";
import CustomDialogComponent from "../../components/Dialog/Dialog";
import { useRouter } from "next/router";

const requestSentImg = "/images/Request_Sent.svg";
const closeIcon = "/images/close_Icon.svg";
const downloadIcon = "/images/Download_Icon.svg";

const PayLaterDialog = (props: any) => {
  const { open } = props;
  const router = useRouter();
  const [openClose, setOnClose] = React.useState(open);

  const handleClose = () => {
    setOnClose(false);
  };

  const redirectToLogin = () => {
    console.log("Inside redirect");
    router.push("/login/");
  };

  useEffect(() => {
    setOnClose(props.open);
  }, [props.open]);

  return (
    <CustomDialogComponent
      aria-labelledby="simple-dialog-title"
      open={openClose}
    >
      <Container maxWidth="sm" className={`p-0 m-0`}>
        <CustomCard className={`p-3 ${styles.otpCard}`}>
          <div className="d-flex bd-highlight">
            <div
              className={`p-2 w-100 align-items-center justify-content-center bd-highlight`}
            >
              <Typography className={`pl-2 ${styles.title}`} color="primary">
                Application Submitted
              </Typography>
            </div>
            <div className={`p-2 justify-content-end `}>
              <img
                className={`${styles.closeIcon}`}
                src={closeIcon}
                alt="closeIcon"
                onClick={handleClose}
              />
            </div>
          </div>
          <img className="p-3" src={requestSentImg} alt="requestSentImg" />
          <Typography className={`pt-3`}>
            <span className={`${styles.subLabel}`}>
              Application number 998766 has been submitted
            </span>
          </Typography>
          <Typography className="p-3">
            <span className={`${styles.spanLabel}`}>
              We request you to visit the nearby Bharat Petroleum Fuel Station{" "}
            </span>
            <br />
            <span className={`${styles.spanLabel}`}>
              and complete the payment for a successful enrolment
            </span>
          </Typography>
          <div className="d-flex bd-highlight mt-3 mb-4 justify-content-center">
            <div className={`align-items-center justify-content-center pr-3`}>
              <Button
                className={` ${styles.btnDialog}`}
                variant="outlined"
                color="primary"
                disableElevation
              >
                VIEW APPLICATION
              </Button>
            </div>
            <div className={`align-items-center justify-content-center`}>
              <Button
                className={`${styles.btnDialog}`}
                variant="contained"
                color="primary"
                disableElevation
                startIcon={<img src={downloadIcon} alt="downloadIcon" />}
              >
                APPLICATION PDF
              </Button>
            </div>
          </div>
          <Typography variant="caption" className={`${styles.bottomLabel}`}>
            Back to?{" "}
            <span
              className={`MuiTypography-colorPrimary ${styles.cursorPointer}`}
              onClick={() => redirectToLogin()}
            >
              Sign In
            </span>{" "}
          </Typography>
        </CustomCard>
      </Container>
    </CustomDialogComponent>
  );
};

export default PayLaterDialog;
