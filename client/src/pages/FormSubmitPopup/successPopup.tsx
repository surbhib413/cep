import React, { useEffect } from "react";
import styles from "./FormSubmitPopup.module.scss";
import Container from "@material-ui/core/Container";
import CustomCard from "../../components/CustomCard/CustomCard";
import { Typography, Button } from "@material-ui/core";
import CustomDialogComponent from "../../components/Dialog/Dialog";
import { useRouter } from "next/router";

const requestSentImg = "/Request_Sent.svg";
const closeIcon = "/close_Icon.svg";
const downloadIcon = "/Download_Icon.svg";

const CustomDialog = (props: any) => {
  const router = useRouter();
  const { open } = props;
  const [openClose, setOnClose] = React.useState(open);

  const handleCloseEvent = () => {
    props.onClose();
    //setOnClose(false);
  };

  const redirectToLogin = () => {
    // props.history.push("/login/");
    router.push("/login/");
  };

  const redirectToDesc = () => {
    // props.history.push("/view/application");
    router.push("/view/application");
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
                onClick={handleCloseEvent}
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
              Your request for Fee Waiver has been initiated{" "}
            </span>
            <p className={`${styles.spanLabel}`}>
              The enrollment is subject to the Bharat Petroleum Approval{" "}
            </p>
          </Typography>
          <div className="d-flex bd-highlight mt-3 mb-4 justify-content-center">
            <div className={`align-items-center justify-content-center pr-3`}>
              <Button
                className={` ${styles.btnDialog}`}
                variant="outlined"
                color="primary"
                disableElevation
                onClick={() => redirectToDesc()}
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

export default CustomDialog;
