import React, { useEffect } from "react";
import styles from "./FormSubmitPopup.module.scss";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import CustomDialogComponent from "../../components/Dialog/Dialog";
import CustomCard from "../../components/CustomCard/CustomCard";

const requestSentImg = "/Reject_Icon.svg";
const closeIcon = "/close_Icon.svg";

const CustomDialog = (props: any) => {
  const { open } = props;
  const [openClose, setOnClose] = React.useState(open);

  const handleCloseEvent = () => {
    props.onClose();
    //setOnClose(false);
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
                Fee Waiver Request Rejected
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
              Your request for Fee Waiver has been rejected
            </span>
          </Typography>
          <Typography className="p-3">
            <span className={`${styles.spanLabel}`}>
              Resubmit the form by using an alternative payment method{" "}
            </span>
            {/* <p className={`${styles.spanLabel}`}>The enrollment is subject to the BPCL Approval </p> */}
          </Typography>
        </CustomCard>
      </Container>
    </CustomDialogComponent>
  );
};

export default CustomDialog;
