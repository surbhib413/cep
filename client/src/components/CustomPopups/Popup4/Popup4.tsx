import { DialogContent, Hidden, Typography } from "@material-ui/core";
import React from "react";
import styles from "./Popup4.module.scss";
import { CustomButton } from "../../CustomButton/CustomButton";
import Dialog from "@material-ui/core/Dialog";
// import { useSelector } from "react-redux";
const requestSentImg = "/w_illustrations_card-added-web.svg";
const requestSentMblImg = "/M_Illus-B2B_card-added-Successful.svg";

export const Popup4 = (props: any) => {
  const { open, close, closeAndSubmit, title, description, btnText } = props;

  // const store: any = useSelector((state) => state);

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={close} fullWidth={true} maxWidth="sm">
      <DialogContent
        className={`d-flex flex-column align-items-center py-3 py-sm-4 px-2 px-sm-4`}
      >
        <Typography className={`pb-4 ${styles.popStyles}`} variant="h5" color="primary">
          {title}
        </Typography>

        <Hidden xsDown>
          <img
            className={`${styles.illustration}`}
            src={requestSentImg}
            alt="password reset successful image"
          />
        </Hidden>
        <Hidden smUp>
          <img
            className={`${styles.illustration}`}
            src={requestSentMblImg}
            alt="password reset successful image"
          />
        </Hidden>
        <Typography className={`pb-4 pt-3 ${styles.description}`} variant="subtitle1" color="textPrimary">
          {description}
        </Typography>
        <CustomButton
          className={`${styles.button}`}
          color="primary"
          variant="contained"
          onClick={closeAndSubmit}
        >
          {btnText}
          {/* Proceed to payment */}
        </CustomButton>
      </DialogContent>
    </Dialog>
  );
};
