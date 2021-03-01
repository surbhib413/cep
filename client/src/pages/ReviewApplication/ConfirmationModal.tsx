import { Dialog, DialogContent, Typography } from "@material-ui/core";
import React from "react";
import styles from "./ConfirmationModal.module.scss";
import { CustomButton } from "../../components/CustomButton/CustomButton";
// import { useSelector } from "react-redux";

const CancelIcon = "/Cancel_Icon.svg";
const WIconWarning = "/W_icon_warning.svg";

export const ConfirmationModal = (props: any) => {
  const { open, close, closeAndSubmit, title, description } = props;

  // const store: any = useSelector((state) => state);

  const closeAndSubmitHandler = () => {
    closeAndSubmit();
  };

  return (
    <Dialog open={open} onClose={close} fullWidth={true} maxWidth="sm">
      <DialogContent
        className={`${styles.confirmationContainer} d-flex flex-column align-items-center justify-content-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <div className="w-100 d-flex bd-highlight align-items-center justify-content-center">
          <Typography
            className={`px-4 px-sm-0 text-center`}
            variant="h5"
            color="primary"
          >
            {title}
          </Typography>
          <img
            src={CancelIcon}
            alt=""
            className={`p-2 ${styles.cursorPointer} ${styles.cancelIconPos} `}
            onClick={close}
          />
        </div>

        <img className="p-4" src={WIconWarning} alt="requestSentImg" />
        <Typography className={`mx-2 px-5 text-center`} variant="subtitle1">
          {/* Are you sure you want to go back to enrolment request? Any changes
          made on this page will be lost. */}
          {description}
          {/* {description.split("\n").map((item: any, key: any) => {
            return (
              <React.Fragment key={key}>
                {item}
                <br />
              </React.Fragment>
            );
          })} */}
        </Typography>

        <div className="w-100 pt-4 d-flex justify-content-center align-items-center">
          <CustomButton
            onClick={close}
            variant="outlined"
            color="primary"
            className={`${styles.backToEnrolmentBtn} mx-4`}
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={closeAndSubmitHandler}
            variant="contained"
            color="primary"
            // className="mr-4"
          >
            Continue
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
