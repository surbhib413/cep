import { DialogContent, Hidden, Typography } from "@material-ui/core";
import React from "react";
import styles from "./OtpVerification.module.scss";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import Dialog from "@material-ui/core/Dialog";
import { useSelector } from "react-redux";

const CancelIcon = "/Cancel_Icon.svg";
const b2bIllustration = "/WM_Illus-B2B_PC-Registration-Success.svg";
const b2bMobileIllustration = "/M_Illus-B2B_PetroCorp-Registration-Successful.svg";

export const SelfEnrolledModal = (props: any) => {
  const {
    verificationComplete,
    closeSelfEnrolledModal,
    redirectToBusinessSelectionPage,
  } = props;

  const store: any = useSelector((state) => state);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={verificationComplete}
      onClose={closeSelfEnrolledModal}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogContent
        className={`${styles.confirmationContainer} d-flex flex-column align-items-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-center">
          {/* <img alt="" style={{ opacity: 0 }} className="p-3" /> */}
          <Typography
            className={`px-4 px-sm-0 text-center ${styles.modalTitle}`}
            variant="h5"
            color="primary"
          >
            Congratulations on Successful Enrollment !
          </Typography>
          {/* <img
            src={CancelIcon}
            alt=""
            data-test-id="cancel-btn"
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
            onClick={closeSelfEnrolledModal}
          /> */}
        </div>
        <Hidden xsDown>
          <img
            className="p-4"
            src={b2bIllustration}
            alt="requestSentImg"
          />
        </Hidden>
        <Hidden smUp>
          <img className="p-4" src={b2bMobileIllustration} alt="requestSentImg" />
        </Hidden>

        <Typography variant="h6" color="textPrimary" className="text-center">
          Welcome to Bharat Petroleum Family
        </Typography>
        <Typography variant="h6" color="textPrimary" className="text-center">
          You have been successfully enrolled to CEP
        </Typography>
        {/* <p className={`mb-1 mt-3 ${styles.customerDetails}`}>
          Customer Details
        </p> */}
        <Hidden xsDown>
          <p className={`mt-0 py-3 ${styles.customerDetailsValue}`}>
            <span className={`${styles.customerDetailsLabel}`}>User ID: </span>
            {store.username}
          </p>
        </Hidden>
        <Hidden smUp>
          <div className={`pb-3 ${styles.customerDetailsValue}`}>
            <p className="text-center">
              <span className={`${styles.customerDetailsLabel}`}>
                User ID:{" "}
              </span>
              {store.username}
            </p>
          </div>
        </Hidden>
        <CustomButton
          color="primary"
          variant="contained"
          data-test-id="continue-btn"
          onClick={() => redirectToBusinessSelectionPage()}
        >
          CONTINUE TO REGISTRATION
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
};
