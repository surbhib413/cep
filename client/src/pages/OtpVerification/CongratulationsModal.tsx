import { DialogContent, Hidden, Typography } from "@material-ui/core";
import React from "react";
import styles from "./OtpVerification.module.scss";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import Dialog from "@material-ui/core/Dialog";
import { useSelector } from "react-redux";

const CancelIcon = "Cancel_Icon.svg";
const llustrations_Smartfleet = "W_llustrations_Smartfleet.svg";
const mobileIllustration = "mobile_Congratulations_Img.svg";
const b2bIllustration = "/WM_Illus-B2B_PC-Registration-Success.svg";
const b2bMobileIllustration = "/M_Illus-B2B_PetroCorp-Registration-Successful.svg";

// Assited Modal
export const CongratulationsModal = (props: any) => {
  const {
    verificationComplete,
    closeCongratulationsModal,
    redirectToSmartfleetRegistration,
  } = props;

  const store: any = useSelector((state) => state);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={verificationComplete}
      onClose={closeCongratulationsModal}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogContent
        className={`${styles.confirmationContainer} d-flex flex-column align-items-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-center">
          {/* <img alt="" className={`p-3 ${styles.noOpacity}`} /> */}
          <Typography
            className={`px-4 px-sm-0 text-center ${styles.modalTitle}`}
            variant="h5"
          >
            Congratulations on Successful Enrollment !
          </Typography>
          {/* <img
            src={CancelIcon}
            alt=""
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos}`}
            onClick={closeCongratulationsModal}
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
          Welcome to Bharat Petroleum Family!
        </Typography>
        <Typography variant="h6" color="textPrimary" className="text-center">
          Customer has been successfully enrolled.
        </Typography>
        <p className={`mb-1 mt-3 ${styles.customerDetails}`}>
          Customer Details
        </p>
        <Hidden xsDown>
          <p className={`mt-0 pb-3 ${styles.customerDetailsValue}`}>
            {store.assistedCustomerName && (
              <>
                <span className={`${styles.customerDetailsLabel}`}>Name: </span>{" "}
                {store.assistedCustomerName} |{" "}
              </>
            )}
            <span className={`${styles.customerDetailsLabel}`}>User ID: </span>
            {store.assistedCustomerUsername}
          </p>
        </Hidden>
        <Hidden smUp>
          <div className={`pb-3 ${styles.customerDetailsValue}`}>
            {store.assistedCustomerName && (
              <p className="my-0 text-center">
                <span className={`${styles.customerDetailsLabel}`}>Name: </span>
                {store.assistedCustomerName}
              </p>
            )}
            <p className="text-center">
              <span className={`${styles.customerDetailsLabel}`}>
                User ID:{" "}
              </span>
              {store.assistedCustomerUsername}
            </p>
          </div>
        </Hidden>
        <CustomButton
          color="primary"
          variant="contained"
          onClick={() => redirectToSmartfleetRegistration()}
        >
          CONTINUE TO REGISTRATION
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
};
